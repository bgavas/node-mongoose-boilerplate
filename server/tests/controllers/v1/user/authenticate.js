const expect = require('expect');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const strings = require('./../../../../constants/string');
const userSeed = require('./../../../seeds/user.seed');

module.exports = (app, routePrefix) => {

    describe(`GET/${routePrefix}/authenticate`, () => {

        it('should verify the authentication', (done) => {

            request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_AUTH_TOKEN]: userSeed.users[0].authTokens[0].token,
                    [strings.HEADER_REFRESH_TOKEN]: userSeed.refreshTokens[0].token
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.SUCCESS_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeTruthy();
                })
                .end(done);

        });

        it('should verify the authentication if jwt is expired but refresh token is valid', (done) => {

            // Set timeout to wait the token to be deleted
            setTimeout(() => request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_AUTH_TOKEN]: userSeed.users[0].authTokens[1].token,
                    [strings.HEADER_REFRESH_TOKEN]: userSeed.refreshTokens[0].token
                })
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.SUCCESS_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeTruthy();
                })
                .end(done), 1000);

        });

        it('should get 401 if jwt is expired and refresh token is invalid', (done) => {

            // Set timeout to wait the token to be deleted
            setTimeout(() => request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_AUTH_TOKEN]: userSeed.users[0].authTokens[1].token,
                    [strings.HEADER_REFRESH_TOKEN]: 'invalidRefreshToken'
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.FAIL_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeFalsy();
                })
                .end(done), 1000);

        });

        it('should get 401 if jwt is expired and refresh token is not provided', (done) => {

            // Set timeout to wait the token to be deleted
            setTimeout(() => request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_AUTH_TOKEN]: userSeed.users[0].authTokens[1].token
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.FAIL_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeFalsy();
                })
                .end(done), 1000);

        });

        it('should get 401 if jwt secret is incorrect', (done) => {

            request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_AUTH_TOKEN]: jwt.sign({_id: userSeed.users[0]._id}, process.env.JWT_SECRET + 'ss').toString(),
                    [strings.HEADER_REFRESH_TOKEN]: userSeed.refreshTokens[0].token
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.FAIL_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeFalsy();
                })
                .end(done);

        });

        it('should get 401 if auth token not provided', (done) => {

            request(app)
                .get(`/${routePrefix}/authenticate`)
                .set({
                    [strings.HEADER_REFRESH_TOKEN]: userSeed.refreshTokens[0].token
                })
                .expect(401)
                .expect((res) => {
                    expect(res.body.status).toBe(strings.FAIL_RESPONSE);
                    expect(res.headers[[strings.HEADER_AUTH_TOKEN]]).toBeFalsy();
                })
                .end(done);

        });

    });

}