from __future__ import absolute_import, unicode_literals

from django.db import models
from django.core.cache import cache

from wagtail.wagtailcore.models import Page
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailadmin.edit_handlers import FieldPanel

class HomePage(Page):
    foo = "hello chewbakka"

    def visited(self):
        """ Updates the visited count by one in the cache
        :return: The visited count in string form.
        """
        visited = cache.get('visited')
        print "visited", visited

        if not visited:
            visited = 0
        else:
            visited = int(visited)
        visited += 1
        cache.set('visited', str(visited))

        return str(visited)

    #content_panels = Page.content_panels + [
    #    FieldPanel('body', classname="full"),
    #]
