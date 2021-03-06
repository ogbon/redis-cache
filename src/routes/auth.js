/* eslint-disable babel/new-cap */
import express from 'express'

import authController from '../controllers/auth'
import schemas from '../helpers/schemas'
import validators from '../middlewares/validators'
import permissions from '../middlewares/permissions'

const auth = express.Router()

auth.route('/sign-in')
  .post(validators.requestSchema(schemas.auth.signIn, 'body'), authController.signIn)

auth.route('/sign-up')
  .post(validators.requestSchema(schemas.auth.signUp, 'body'), authController.signUp)

auth.route('/users')
  .get(permissions.isAuthenticated, authController.index)


export default auth
