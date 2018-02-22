# flask_sqlalchemy/schema.py
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, User as UserModel, DBHelper, Pet as PetModel, Pma_home as Pma_homeModel, Pma_base
from dateutil import parser
import time

class Pet(SQLAlchemyObjectType):
    class Meta:
        model = PetModel

class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel

class PetField(graphene.InputObjectType):
    name                = graphene.String(required=True)
    link_uuid_avatar    = graphene.String()

# helper
def helper_create_pet(pet_field, user):
    pet = PetModel(name=pet_field.name)

    #if pet_field.link_uuid_avatar is not None:
    #    path            = synch_from_default_bucket(pet_field.link_uuid_avatar, "pet_name")
    #    pet.url_avatar  = path

    pet.user = user

##################### helper ######################

def query_id_by_className(cls_name, id):
    cls = eval(cls_name)
    obj = None

    if id is not None:
        obj = db_session.query(cls).filter(cls.id == id).first()
    # ! else
    if obj is None:
        obj = cls()

    return obj

def map_value_from_input(obj, input):
    for attr, value in input.__dict__.iteritems():
        if value is not None:
            setattr(obj, attr, value)

    return obj

def date_duration_validation(obj, input):
    # TODO, check overlap and date validity
    if input.date_start is not None:
        print "date", input.date_start, parser.parse(input.date_start)
        obj.date_start = input.date_start
        print "confirm ", obj.date_start

    if input.date_end is not None:
        obj.date_end = input.date_end


    return obj

##################### BASE ######################

class Category_language(graphene.Enum):
    FR = 0
    ES = 1
    IT = 2

class Pma_base_input(graphene.InputObjectType):
    date_start      = graphene.String()
    date_end        = graphene.String()
    id              = graphene.Int()
    category        = Category_language()
    is_active       = graphene.Boolean()
################### HOME_PMA #####################

class Pma_home(SQLAlchemyObjectType):
    class Meta:
        model = Pma_homeModel

    def resolve_date_start(self, info):
        if self.date_start is None:
            return time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time()))
        else:
            return self.date_start

    def resolve_date_end(self, info):
        if self.date_end is None:
            return time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time()))
        else:
            return self.date_end

class Pma_home_input(Pma_base_input):
    title           = graphene.String(required=True)
    caption         = graphene.String(required=True)
    url_pma_image   = graphene.String()

class Mutate_Pma_home(graphene.Mutation):
    class Arguments:
        pma_data = Pma_home_input(required=True)

    pma = graphene.Field(Pma_home)

    @staticmethod
    def mutate(self, info, pma_data=None):
        pma = query_id_by_className("Pma_homeModel", pma_data.id)
        pma = map_value_from_input(pma, pma_data)
        pma = date_duration_validation(pma, pma_data)

        DBHelper.fast_commit(pma)

        if pma.date_start is not None:
            print"from DB", pma.date_start

        return Mutate_Pma_home(pma=pma)

###################################################

class AddNewPet(graphene.Mutation):
    class Arguments:
        add_pet     = PetField(required=True)
        to_user_id  = graphene.Int(required=True)

    pet = graphene.Field(lambda: Pet)

    def mutate(self, info, add_pet=None, to_user_id=0):
        user = db_session.query(UserModel).filter(UserModel.id == to_user_id).first()
        helper_create_pet(add_pet, user)
        DBHelper.fast_commit(pet)

        return AddNewPet(pet=pet)

class CreateUser(graphene.Mutation):
    class Arguments:
        name        = graphene.String(required=True)
        add_pet     = PetField(required=False)

    user = graphene.Field(lambda: User)

    @staticmethod
    def mutate(self, info, name, add_pet=None, file=None):
        user = UserModel(name=name)

        if add_pet is not None:
            helper_create_pet(add_pet, user)

        DBHelper.fast_commit(user)
        return CreateUser(user=user)

class Query(graphene.ObjectType):
    all_users   = graphene.List(User)
    all_pmaHome = graphene.List(Pma_home)

    def resolve_all_users(self, info, **args):
        query = User.get_query(info)  # SQLAlchemy query
        return query.all()

    def resolve_all_pmaHome(self, info, **args):
        query = Pma_home.get_query(info)  # SQLAlchemy query
        return query.all()

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    add_new_pet = AddNewPet.Field()
    mutate_Pma_home = Mutate_Pma_home.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
