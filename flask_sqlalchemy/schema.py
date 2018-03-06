# flask_sqlalchemy/schema.py
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, DBHelper, Pma_base as Pma_baseModel, Pma_home as Pma_homeModel, Pma_gallery as Pma_galleryModel, Gallery as GalleryModel
from dateutil import parser
import time

##################### helper ######################

def query_id_by_className(cls_name, id, create_if_not_found=True):
    cls = eval(cls_name)
    obj = None

    if id is not None:
        obj = db_session.query(cls).filter(cls.id == id).first()
    # ! else
    if obj is None and create_if_not_found:
        obj = cls()

    return obj

def map_value_from_input(obj, input, exclude = []):
    for attr, value in input.__dict__.iteritems():
        if value is not None and attr not in exclude:
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

##################### deletion ######################

def delete_by_id(cls_name, id):
    del_obj     = query_id_by_className(cls_name, id,create_if_not_found=False)
    did_found   = 1 if del_obj is not None else 0

    if did_found:
        succeed = db_session.delete(del_obj)
        db_session.commit()
        db_session.expunge_all()

    return did_found

##################### BASE ######################

class Category_language(graphene.Enum):
    FR = 0
    ES = 1
    IT = 2

class Pma_base_input(graphene.InputObjectType):
    title           = graphene.String(required=True)
    caption         = graphene.String(required=True)
    date_start      = graphene.String()
    date_end        = graphene.String()
    id              = graphene.Int()
    category        = Category_language()
    is_active       = graphene.Boolean()

class Pma_base(SQLAlchemyObjectType):
    class Meta:
        model = Pma_baseModel

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

################### HOME_PMA #####################

class Pma_home(Pma_base):
    class Meta:
        model = Pma_homeModel

class Pma_home_input(Pma_base_input):
    url_image = graphene.String()

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

class Delete_Pma_home(graphene.Mutation):
    class Arguments:
        id =  graphene.Int(required=True)

    state = graphene.Int()

    @staticmethod
    def mutate(self, info, id=-1):
        return Delete_Pma_gallery(delete_by_id("Pma_homeModel", id))

################### GALLERY_PMA #####################
def mutate_gallery_components(pma, pma_data):
    lenght      = len(pma_data["gallery"]) - len(pma.gallery)
    g_lenght    = len(pma_data["gallery"])

    if lenght >= 0:
        for i in [x for x in xrange(g_lenght) if x != g_lenght + 1]:
            if i <= len(pma.gallery) - 1 and len(pma.gallery) != 0:
                # update
                g = pma.gallery[i]
                g = map_value_from_input(g, pma_data["gallery"][i])
                pma.gallery[i] = g

            else:
                # add
                gallery = GalleryModel()
                g       = map_value_from_input(gallery, pma_data["gallery"][i])
                pma.gallery.append(g)
    else:
        # delete
        del pma.gallery[lenght:]
        # will update since lenght >= 0
        mutate_gallery_components(pma, pma_data)

    return pma

class Gallery(SQLAlchemyObjectType):
    class Meta:
        model = GalleryModel

class Pma_gallery(Pma_base):
    class Meta:
        model = Pma_galleryModel

class gallery_input(graphene.InputObjectType):
    title           = graphene.String()
    caption         = graphene.String()
    url_image       = graphene.String()
    url_redirection = graphene.String()

class Pma_gallery_input(Pma_base_input):
    title    = graphene.String()
    caption  = graphene.String()
    gallery  = graphene.List(gallery_input, required=True)

    #gallery  = graphene.List(Gallery)

class Mutate_Pma_gallery(graphene.Mutation):
    class Arguments:
        pma_data = Pma_gallery_input(required=True)

    pma = graphene.Field(Pma_gallery)

    @staticmethod
    def mutate(self, info, pma_data=None):
        pma = query_id_by_className("Pma_galleryModel", pma_data.id)
        pma = map_value_from_input(pma, pma_data, exclude=["gallery"])
        pma = date_duration_validation(pma, pma_data)
        pma = mutate_gallery_components(pma, pma_data)

        DBHelper.fast_commit(pma)

        if pma.date_start is not None:
            print"from DB", pma.date_start

        return Mutate_Pma_home(pma=pma)

class Delete_Pma_gallery(graphene.Mutation):
    class Arguments:
        id =  graphene.Int(required=True)

    state = graphene.Int()

    @staticmethod
    def mutate(self, info, id=-1):
        return Delete_Pma_gallery(delete_by_id("Pma_galleryModel", id))

###################################################
class Query(graphene.ObjectType):
    all_pma_home     = graphene.List(Pma_home)
    all_pma_gallery  = graphene.List(Pma_gallery)

    def resolve_all_pma_home(self, info, **args):
        query = Pma_home.get_query(info)  # SQLAlchemy query
        return query.all()

    def resolve_all_pma_gallery(self, info, **args):
        query = Pma_gallery.get_query(info)  # SQLAlchemy query
        return query.all()

class Mutation(graphene.ObjectType):
    mutate_Pma_home     = Mutate_Pma_home.Field()
    delete_Pma_home     = Delete_Pma_home.Field()

    mutate_Pma_gallery  = Mutate_Pma_gallery.Field()
    delete_Pma_gallery  = Delete_Pma_gallery.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
