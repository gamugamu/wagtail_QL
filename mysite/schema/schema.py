from django.db import models
from graphene_django import DjangoObjectType
from blog.models import BlogPage, BlogPageGalleryImage
import graphene
from django.core.files.storage import default_storage
from django.core.files.storage import DefaultStorage


class BlogPageGalleryImage_(DjangoObjectType):
    url = graphene.String()

    class Meta:
        model = BlogPageGalleryImage

    def resolve_url(self, info):
        return self.image.file.url

class Blog(DjangoObjectType):
    class Meta:
        model = BlogPage

class CreateBlog(graphene.Mutation):
    ok   = graphene.Boolean()
    blog = graphene.Field(lambda: Blog)

    class Arguments:
        intro = graphene.String()

    def mutate(self, info, **args):
        print "======================= **** will mutate", args
        blog = BlogPage(intro=args["intro"])
        blog.save()
        print "******** ", blog.id
        ok    = True
        return CreateBlog(blog=blog, ok=ok)

class Query(graphene.ObjectType):
    blog_all    = graphene.List(Blog)
    blog        = graphene.Field(Blog, id=graphene.Int())

    def resolve_blog_all(self, info):
        return BlogPage.objects.all()

    def resolve_blog(self, info, **args):
        print "info", args
        return BlogPage.objects.get(id=args["id"])

class Mutation(graphene.ObjectType):
    create_blog = CreateBlog.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
