# flask_sqlalchemy/schema.py
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from models import db_session, Department as DepartmentModel, Employee as EmployeeModel, User as UserModel, DBHelper


class Department(SQLAlchemyObjectType):
    class Meta:
        model = DepartmentModel
        interfaces = (relay.Node, )


class Employee(SQLAlchemyObjectType):
    class Meta:
        model = EmployeeModel
        interfaces = (relay.Node, )

class User(SQLAlchemyObjectType):
    class Meta:
        model = UserModel

class CreateUser(graphene.Mutation):
    class Arguments:
        name = graphene.String()

    ok      = graphene.Boolean()
    user    = graphene.Field(lambda: User)

    def mutate(self, info, name):
        user    = UserModel(name=name)
        ok      = True
        DBHelper.fast_commit(user)

        return CreateUser(user=user, ok=ok)

class Query(graphene.ObjectType):
    all_employees       = SQLAlchemyConnectionField(Employee)
    employee            = graphene.Field(Employee)
    all_users           = graphene.List(User)

    def resolve_all_users(self, info, **args):
        print "info", info.context
        query = User.get_query(info)  # SQLAlchemy query
        print "info", query.first()

        return query.all()

    def resolve_employee(self, info, **args):
        e = EmployeeModel(name="Peter")

        print "result ", e
        print EmployeeModel.get(name="Peter")
        return e

class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)
