# coding: utf-8
# flask_sqlalchemy/models.py
from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship,
                            backref)
from sqlalchemy.ext.declarative import declarative_base

engine      = create_engine('sqlite:///database.sqlite3', convert_unicode=True)
db_session  = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
# We will need this for querying
Base.query = db_session.query_property()

class Department(Base):
    __tablename__   = 'department'
    id              = Column(Integer, primary_key=True)
    name            = Column(String)

class Employee(Base):
    __tablename__   = 'employee'
    id              = Column(Integer, primary_key=True)
    name            = Column(String)
    hired_on        = Column(DateTime, default=func.now())
    department_id   = Column(Integer, ForeignKey('department.id'))
    department      = relationship(
                        Department,
                        backref=backref('employees',
                        uselist=True,
                        cascade='delete,all'))

class User(Base):
    __tablename__   = 'user'
    id              = Column(Integer, primary_key=True)
    name            = Column(String)
    last_name       = Column(String)
    pets            = relationship("Pet", back_populates="user")


class Pet(Base):
    __tablename__   = 'pet'
    id              = Column(Integer, primary_key=True)
    name            = Column(String)
    user_id         = Column(Integer, ForeignKey('user.id'))
    user            = relationship("User", back_populates="pets")
    url_avatar      = Column(String)

class DBHelper():
    @staticmethod
    def fast_commit(instance=None):
        db_session.add(instance)
        db_session.commit()

#crée les tables
Base.metadata.create_all(engine)
