from django.db import models
from graphene_django import DjangoObjectType
from blog.models import BlogPage, BlogPageGalleryImage
import graphene
from django.core.files.storage import default_storage
from  django.core.files.storage import DefaultStorage


class BlogPageGalleryImage_(DjangoObjectType):
    url = graphene.String()

    class Meta:
        model = BlogPageGalleryImage

    def resolve_url(self, info):
        return self.image.file.url

class BlogPage_(DjangoObjectType):
    class Meta:
        model = BlogPage

class Query(graphene.ObjectType):
    blog = graphene.List(BlogPage_)

    def resolve_blog(self, info):
        return BlogPage.objects.all()

schema = graphene.Schema(query=Query)
