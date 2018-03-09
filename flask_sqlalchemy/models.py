# coding: utf-8
# flask_sqlalchemy/models.py
from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base
from enum import Enum

engine      = create_engine('sqlite:///database.sqlite3', convert_unicode=True)
db_session  = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
# We will need this for querying
Base.query = db_session.query_property()

##########################
class User(Base):
    __tablename__   = 'user'
    id              = Column(Integer, primary_key=True)
    name            = Column(String, default="")
    hash_pass       = Column(String, default="")

class Pma_base(Base):
    __tablename__   = 'pmabase'
    id              = Column(Integer, primary_key=True)
    title           = Column(String, default="")
    caption         = Column(String, default="")
    date_start      = Column(String) #Date
    date_end        = Column(String) #Date
    category        = Column(Integer, default=0)
    is_active       = Column(Boolean, default=0)

class Pma_home(Pma_base):
    __tablename__   = 'pmahome'
    id              = Column(Integer, ForeignKey('pmabase.id'), primary_key=True)
    url_image       = Column(String)

class Pma_gallery(Pma_base):
    __tablename__   = 'pmagallery'
    id              = Column(Integer, ForeignKey('pmabase.id'), primary_key=True)
    gallery         = relationship("Gallery", cascade="all, delete-orphan")

class Gallery(Base):
    __tablename__       = 'gallery'
    id                  = Column(Integer, primary_key=True)
    parent_id           = Column(Integer, ForeignKey('pmabase.id'))
    title               = Column(String, default="")
    caption             = Column(String, default="")
    url_image           = Column(String, default="")
    url_redirection     = Column(String, default="")

class DBHelper():
    @staticmethod
    def fast_commit(instance=None):
        db_session.add(instance)
        db_session.commit()

#crée les tables
Base.metadata.create_all(engine)
