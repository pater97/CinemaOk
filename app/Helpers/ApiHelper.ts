import axios from 'axios'

import Logger from '@ioc:Adonis/Core/Logger'
import { Exception } from '@adonisjs/core/build/standalone'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'PATCH'

interface BasicCredentials {
  username: string
  password: string
}

interface ApiHelperConfig {
  url: string
  method?: Method
  baseURL?: string
  headers?: any
  params?: any
  paramsSerializer?: (params: any) => string
  data?: any
  timeout?: number
  auth?: BasicCredentials
}

export default async (config: ApiHelperConfig) => {
  try {
    Logger.info(`Calling '${config.url}'...`)
    const { data } = await axios(config)
    Logger.info(`Finish calling '${config.url}'`)

    return data
  } catch (e) {
    throw new Exception(`Error calling '${config.url}'`)
  }
}
