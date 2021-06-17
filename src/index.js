import Resolver from '@forge/resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
    console.log(req);

    return 'Hello, world!';
});

resolver.define('apiCall', async (req) => {
    const { payload } = req;
    console.log(req);
    // const { cb, params } = payload;
    // const res = await cb(params);
    // console.log(res);
    // return res;
});

export const handler = resolver.getDefinitions();

