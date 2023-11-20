import joi from 'joi'

export const createUser = joi.object({
  body: joi.object({
    name: joi.string().required(),
    lastName: joi.string().required(),
    user: joi.string().required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(12)
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:<>?~_-]).{12,}$'
        )
      )
      .required(),
    confirmPassword: joi
      .string()
      .min(12)
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:<>?~_-]).{12,}$'
        )
      )
      .required()
  })
})
