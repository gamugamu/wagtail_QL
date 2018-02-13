# flask_sqlalchemy/schema.py
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, User as UserModel, DBHelper, Pet as PetModel

class Pet(SQLAlchemyObjectType):
    class Meta:
        model = PetModel

class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel

class PetField(graphene.InputObjectType):
    name        = graphene.String(required=True)
    url_avatar  = graphene.String()

class AddNewPet(graphene.Mutation):
    class Arguments:
        add_pet     = PetField(required=True)
        to_user_id  = graphene.Int(required=True)

    pet = graphene.Field(lambda: Pet)

    def mutate(self, info, add_pet=None, to_user_id=0):
        pet         = PetModel(name=add_pet.name)
        user        = db_session.query(UserModel).filter(UserModel.id == to_user_id).first()
        pet.user    = user
        DBHelper.fast_commit(pet)

        return AddNewPet(pet=pet)

class CreateUser(graphene.Mutation):
    class Arguments:
        name        = graphene.String(required=True)
        add_pet     = PetField(required=False)

    user = graphene.Field(lambda: User)

    def mutate(self, info, name, add_pet=None):
        user = UserModel(name=name)

        if add_pet is not None:
            pet      = PetModel(name=add_pet.name)
            pet.user = user

        DBHelper.fast_commit(user)

        return CreateUser(user=user)

class Query(graphene.ObjectType):
    all_users = graphene.List(User)

    def resolve_all_users(self, info, **args):
        query = User.get_query(info)  # SQLAlchemy query
        return query.all()

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    add_new_pet = AddNewPet.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
