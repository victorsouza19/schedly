let app = require("../src/app");
let supertest = require('supertest');
let request = supertest(app);

test("A aplicação deve responder na porta 3030", () => {

  return request.get("/").then(res => {
    expect(res.statusCode).toEqual(200)
  });
  
});