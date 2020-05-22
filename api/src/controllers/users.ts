import express from 'express';

import { BadRequest } from '@curveball/http-errors';
import { verify } from 'jsonwebtoken';
import { UserPublicData } from 'index';
import { translateText } from '../util';
import config from '../config';
import { User } from '../models';

async function getUserByToken(request: express.Request, response: express.Response) {
    const { token } = request.params;

    if (!token) {
        throw new BadRequest(translateText('errors.wrongAuthToken', request.locale));
    }

    try {
        const userData = await verify(token, process.env.JWT_SECRET) as UserPublicData;
        response.json({ userData });
    } catch (error) {
        throw new BadRequest(translateText('errors.wrongAuthToken', request.locale));
    }
}

async function changeLocale(request: express.Request, response: express.Response) {
    const { locale } = request.body;
    const validatedLocale = config.AVAILABLE_LOCALES.includes(locale) ? locale : config.DEFAULT_LOCALE;

    const userModel = await User.findOne({ where: { id: request.user.id } });
    userModel.locale = validatedLocale;
    await userModel.save();

    response.json({ newLocale: validatedLocale });
}

export default {
    getUserByToken,
    changeLocale,
};
