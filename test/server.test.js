let app = require("../src/index");
let supertest = require('supertest');
let request = supertest(app);

test("A aplicação deve responder na porta 3030", () => {

  return request.get("/").then(res => {
    expect(res.statusCode).toEqual(200)
  });

});

describe("Disponibilidade das páginas", () => {

  test("A aplicação deve carregar a página de Registro", () => {
  });

});