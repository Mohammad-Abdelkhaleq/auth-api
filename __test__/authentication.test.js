'use strict';

const supertest = require("supertest");
const server = require("../src/server.js");
const request = supertest(server.server);
const base64 = require('base-64');

const {db}=require('../src/models/index.js');

beforeAll(async () => {
    await db.sync();
});

describe("Testing server auth ", () => {
    it ("testing signup ", async () => {
        const response = await request.post("/signup").send({
            username: "test",
            password: "test"
        });
        expect(response.status).toEqual(201);
        expect(response.body).toBeInstanceOf(Object);
    });
    it ("testing signin ", async () => {

        // const response = await request.post("/signin").auth('test','test');
        // expect(response.status).toEqual(200);
        // expect(response.body).toBeInstanceOf(Object);
        let userData=base64.encode('test:test');
        let response=await request.post('/signin').set('Authorization',`Basic ${userData}`);
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
    });
});

describe('Testing server ',()=>{
    it('testing 404 ',async()=>{
        const response=await request.get('/notfound');
        expect(response.status).toEqual(404);
    });
    // it('testing 500 ',async()=>{
    //     const response=await request.get('/bad');
    //     expect(response.status).toEqual(500);
    // });
    // i have to create a bad route for 500 error
    it('testing 200 ',async()=>{
        const response=await request.get('/');
        expect(response.status).toEqual(200);
    });
    it ("testing get all ", async () => {
        const response = await request.get("/api/v1/food");
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
    });
    it ("testing get one ", async () => {
        const response = await request.get("/api/v1/food/1");
        expect(response.status).toEqual(200);
        // expect(response.body).toBeInstanceOf(Object);
    });
    it ("testing create ", async () => {
        const response = await request.post("/api/v1/food").send({
            name: "test",
            calories: 100,
            type: "FRUIT"
        });
        expect(response.status).toEqual(201);
        expect(response.body).toBeInstanceOf(Object);
    });
    it ("testing update ", async () => {
        const response = await request.put("/api/v1/food/1").send({
            name: "test",
            calories: 100,
            type: "FRUIT"
        });
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
    });
    it ("testing delete ", async () => {
        const response = await request.delete("/api/v1/food/1");
        expect(response.status).toEqual(200);
        // expect(response.body).toBeInstanceOf(Object);
    });
});

describe('Testing server V2', () => {
    it("should get all records", async () => {
      const authResponse = await request.post("/signup").send({
        username: "testuser",
        password: "testpassword"
      });
  
      const token = authResponse.body.token; // Access the token property from the response body
      console.log(token);
      const response = await request.get("/api/v2/food")
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
    });


    it("should get one record ", async () => {

        const authResponse = await request.post("/signup").send({
          username: "testuser2",
          password: "testpassword"
        });
    
        const token = authResponse.body.token; // Access the token property from the response body
        console.log(token);
        const response = await request.get("/api/v2/food/1")
          .set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toEqual(200);
        // expect(response.body).toBeInstanceOf(Object);
    });

    it("should create a record ", async () => {
            
            const authResponse = await request.post("/signup").send({
            username: "testuser3",
            password: "testpassword",
            role: "admin"
            });
        
            const token = authResponse.body.token; // Access the token property from the response body
            console.log(token);
            const response = await request.post("/api/v2/food").send({
                name: "test",
                calories: 100,
                type: "FRUIT"
            })
            .set('Authorization', `Bearer ${token}`);
        
            expect(response.status).toEqual(201);
            expect(response.body).toBeInstanceOf(Object);
    });


    //     it("should update a record ", async () => {
                
//             const authResponse = await request.post("/signup").send({
//             username: "testuser4",
//             password: "testpassword",
//             role: "admin"
//             });
        
//             const token = authResponse.body.token; // Access the token property from the response body
            
//              await request.post("/api/v2/food").send({
//                 name: "test",
//                 calories: 100,
//                 type: "FRUIT"
//             })
//             .set('Authorization', `Bearer ${token}`);
    
//             const response = await request.put("/api/v2/food/1").send({
//                 name: "test2",
//                 calories: 100,
//                 type: "FRUIT"
//             })
//             .set('Authorization', `Bearer ${token}`);
        
//             expect(response.status).toEqual(200);
//             expect(response.body).toBeInstanceOf(Object);
//     });


    it("should delete a record ", async () => {
                    
                const authResponse = await request.post("/signup").send({
                username: "testuser4",
                password: "testpassword",
                role: "admin"
                });
            
                const token = authResponse.body.token; // Access the token property from the response body
                
                await request.post("/api/v2/food").send({
                    name: "test",
                    calories: 100,
                    type: "FRUIT"
                })
                .set('Authorization', `Bearer ${token}`);
        
                const response = await request.delete("/api/v2/food/1")
                .set('Authorization', `Bearer ${token}`);
            
                expect(response.status).toEqual(200);
                // expect(response.body).toBeInstanceOf(Object);
    });

});

// describe('Testing server V2', () => {

//     it("should update a record ", async () => {
                
//             const authResponse = await request.post("/signup").send({
//             username: "testuser4",
//             password: "testpassword",
//             role: "admin"
//             });
        
//             const token = authResponse.body.token; // Access the token property from the response body
            
//              await request.post("/api/v2/food").send({
//                 name: "test",
//                 calories: 100,
//                 type: "FRUIT"
//             })
//             .set('Authorization', `Bearer ${token}`);
    
//             const response = await request.put("/api/v2/food/1").send({
//                 name: "test2",
//                 calories: 100,
//                 type: "FRUIT"
//             })
//             .set('Authorization', `Bearer ${token}`);
        
//             expect(response.status).toEqual(200);
//             expect(response.body).toBeInstanceOf(Object);
//     });


// });


 

afterAll(async () => {
    await db.drop();
});