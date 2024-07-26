from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    username = fields.Str(required=True, validate=[
        validate.Length(min=3, max=80),
        validate.Regexp("^[a-zA-Z0-9_.-]+$", error="Username can only contain letters, numbers, and ._-")
    ])
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    full_name = fields.Str(validate=validate.Length(max=120))
    bio = fields.Str()

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class ProfileUpdateSchema(Schema):
    full_name = fields.Str(validate=validate.Length(max=120))
    bio = fields.Str()