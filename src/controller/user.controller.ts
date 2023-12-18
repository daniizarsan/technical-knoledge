import { RequestHandler } from "express";

import { startTransaction, commit, rollback, query, deleteField } from "@queries";
import { User } from "@models/user.model";
import { controlResponse, sendBadParam, sendConflict, sendForbidden, sendNotFound, sendOk, sendServerError } from "@utils/messages.utils";


/**
 * Get all users
 * @route GET /user
 * @group User
 * @returns {object} 200 - Ok
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const getAllUsers: RequestHandler = async (req, res) => {
  let user: User = new User(null)

  user.getAll((status: any, result: any) => {

    switch (status) {
      case 200: sendOk(res, 200, result); return;
      default: controlResponse(status, res, result); return;
    }
  })
}


/**
 * Get a user filter by id
 * @route GET /user/:id
 * @group User
 * @returns {object} 200 - Ok
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const getInfoUser: RequestHandler = async (req, res) => {
  const id: Number = parseInt(req.params.id)

  if (!id) { sendBadParam(res, "ID not defined"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${id};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    sendOk(res, 200, result.length ? result[0] : {});
  })
}


/**
 * Add a new user
 * @route POST /user
 * @group User
 * @param {string} name.body.required - Field name of the user  
 * @param {string} lastname.body.required - Field lastname of the user  
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const addNewUser: RequestHandler = async (req, res) => {
  let user: User = new User({
    name: req.body.name,
    lastname: req.body.lastname
  })

  startTransaction();
  user.add((status: any, result: any) => {
    switch (status) {
      case 201: commit(); sendOk(res, 201, { message: "User added" }); return;
      default: rollback(); controlResponse(status, res, result); return;
    }
  })
}


/**
 * Delete a user
 * @route DELETE /user/:id
 * @group User
 * @param {string} id.param.required - Field name of the user
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const deleteUser: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, "User not found"); return;
    }

    query(`SELECT * FROM user_home uh WHERE uh.id_user = ${userId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      if (result.length) {
        sendConflict(res, "User have homes assigned"); return;
      }

      startTransaction();
      deleteField("user", ["id"], [userId.toString()], (status: any, result: any) => {
        if (!status) {
          sendServerError(res); return;
        }

        commit(); sendOk(res, 202, { message: "User deleted" });
      })
    })
  })
}


/**
 * Update all info of a user
 * @route PUT /user/:id
 * @group User
 * @param {string} name.body.required - Field name of the user  
 * @param {string} lastname.body.required - Field lastname of the user  
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const updateAllInfoUser: RequestHandler = async (req, res) => {

  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }

  if ( !req.body.name || !req.body.lastname ) {
    sendBadParam(res, "Fields of user bad form"); return;
  }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, "User not found"); return;
    }

    startTransaction();

    if ( !req.body.name && !req.body.lastname ) {
      sendBadParam(res, "Fields of user bad form"); return;
    }

    query(`UPDATE user SET name = '${req.body.name}', lastname = '${req.body.lastname}' WHERE id = ${userId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      commit(); sendOk(res, 202, { message: "User updated" });
    })
  })
}



/**
 * Update info of a user
 * @route PATCH /user/:id
 * @group User
 * @param {string} id.param.required - Field name of the user
 * @param {string} name.body - Field name of the user  
 * @param {string} lastname.body - Field lastname of the user  
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const updateInfoUser: RequestHandler = async (req, res) => {

  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }
  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, "User not found"); return;
    }

    startTransaction();

    const name: string = req.body.name ? req.body.name : result[0].name;
    const lastname: string = req.body.lastname ? req.body.lastname : result[0].lastname;

    query(`UPDATE user SET name = '${name}', lastname = '${lastname}' WHERE id = ${userId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      commit(); sendOk(res, 202, { message: "User updated" });
    })
  })
}