import * as Promise from 'bluebird'

import AuthService from '../services/AuthService'
import {UNAUTHORIZED, CREATED, UNPROCESSABLE_ENTITY, OK} from '../constants/statusCodes'
import {setToRedis} from '../helpers/redis'
import {secureRandom} from '../helpers/tools'

const authService = new AuthService()

const authController = {
  signIn: (req, res) => {
    Promise.try(() => authService.signIn(req.body)).then(({token, user}) => {
      const redisToken = secureRandom(8)

      setToRedis(redisToken, token)
      res.status(OK).send({data: {token: redisToken, user}, message: 'Login successful', success: true})
    }).catch((err) => {
      res.status(UNAUTHORIZED).send({data: null, message: 'Email and/or password is incorrect.', success: false})
    })
  },

  signUp: (req, res) => {
    Promise.try(() => authService.signUp(req.body))
      .then(data => res.status(CREATED).send({data, message: 'Sign Up successful', success: true}))
      .catch((err) => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to process your request',
        success: false
      }))
  },

  index: (req, res) => {

    Promise.try(() => authService.find())
      .then(users => res.status(OK).send({data: users, message: null, success: true}))
      .catch((err) => res.status(UNPROCESSABLE_ENTITY).send({
        data: null,
        message: 'Unable to complete your request at the moment.',
        success: false
      }))
  }

}

export default authController
