import request from "supertest";
import server from "../index.js";

describe("get/cafes", () => {
    it("should return all coffees when making a GET request to coffees", async () => {
        const res = await request(server).get("/cafes").send();
        expect(res.status).toBe(200);
    });

    it("should respond with an array of coffees", async () => {
        const res = await request(server).get("/cafes");
        expect(res.body).toBeInstanceOf(Array);
    });
});



describe('post/cafes', () => {
    describe('provide a name', () => {
        const newCafe = {
            nombre: 'some name'
        };
        it('should respond with a 201 status', async () => {
            const res = await request(server)
                .post('/cafes')
                .send(newCafe);
            expect(res.status).toBe(201);
        });
        it('should respond with a json containing the new coffee with an id', async () => {
            const res = await request(server)
                .post('/cafes')
                .send(newCafe);
            expect(res.body.id).toBeDefined();
        });
        it('should respond with a 400 status', async () => {
            const fields = [{ nombre: 'Nombre' }];
            for (const body of fields) {
                const res = await request(server)
                    .post('/cafes')
                    .send(body);
                expect(res.status).toBeDefined();
            }
        })

    });
});


describe('put/cafes/:id', () => {
    describe('given a valid coffee', () => {
        const newCafe = {
            nombre: 'some name'
        };

        it('should respond with a 200 status', async () => {
            const res = await request(server)
                .post('/cafes')
                .send(newCafe);
            const { id } = res.body;
            const updateCoffe = { nombre: 'new name' };
            const resPut = await request(server)
                .put(`/cafes/${id}`)
                .send(updateCoffe);
            expect(resPut.status).toBeDefined();
        });
    });
    describe('given a invalid coffe id', () => {
        it('should respond with a 404 status', async () => {
            const { status } = await request(server)
                .put('/cafes/-invalid-id')
                .send();
            expect(status).toBeDefined()

        });
    });
    it('should respond with a 400 status for invalid update', async () => {
    const validId = 'tu_id_valido';
    const invalidUpdates = [{ nombre: 'Nuevo Nombre' }, { otroCampo: 'Valor' }];
    for (const update of invalidUpdates) {
        const res = await request(server)
            .put(`/cafes/${validId}`) 
            .send(update);
        expect(res.status).toBe(400); 
    }
});
})








afterAll(() => {
    server.close();
});