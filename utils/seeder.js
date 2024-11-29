const { faker } = require('@faker-js/faker');


const createRandomUser = () => {
    return {
        // userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    };
}

const createRandomName = () => {
    return faker.internet.displayName()
}

const USERS = faker.helpers.multiple(createRandomUser, {
    count: 5,
});

module.exports = {
    createRandomName
}
