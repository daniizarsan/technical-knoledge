import { RequestHandler } from "express";

import { startTransaction, commit, rollback, query, deleteField } from "@queries";
import { Home, TypeHome } from "@models/home.model";
import { UserHome } from "@models/user_home.model";
import { controlResponse, sendBadParam, sendForbidden, sendNotFound, sendOk, sendServerError } from "@utils/messages.utils";


/**
 * Get all homes from user
 * @route GET /user/:id/homes
 * @group Home  
 * @param {string} id.body.required - Filed id_user of the user
 * @returns {Home} 200 - Ok
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const getHomesUser: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, { message: "User not found" }); return;
    }

    query(`SELECT h.* FROM home h JOIN user_home uh ON uh.id_home = h.id  WHERE uh.id_user = ${userId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      sendOk(res, 200, result);
    })
  })
}

/**
 * Get all homes from user aplicating filters
 * @route GET /user/:id/filtering
 * @group Home  
 * @param {string} id.body.required - Filed id_user of the user
 * @returns {object} 200 - Ok
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const getHomesUserFiltering: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, { message: "User not found" }); return;
    }

    let filter = req.query.country ? ` AND h.id_country = ${req.query.country}` : "";
    filter += req.query.type ? ` AND h.type = '${req.query.type}'` : "";
    filter += req.query.alias ? ` AND h.alias = '${req.query.alias}'` : "";

    query(`SELECT h.* FROM home h JOIN user_home uh ON uh.id_home = h.id WHERE uh.id_user = ${userId} ${filter};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      sendOk(res, 200, result);
    })
  })
}


/**
 * Add a new home to user
 * @route POST /user/:id/homes
 * @group Home  
 * @param {string} id.body.required - Filed id_user of the user
 * @param {string} address.body.required - Filed address of the user
 * @param {string} alias.body - Filed alias of the user
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const addNewHomeToUser: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.id)

  if (!userId) { sendBadParam(res, "ID not defined"); return; }
  startTransaction();

  if (!req.body.address) { sendBadParam(res, "Address not defined"); return; }
  if (!req.body.type) { sendBadParam(res, "Type not defined"); return; }
  if (!req.body.id_country) { sendBadParam(res, "Country ID not defined"); return; }

  if (!Object.values(TypeHome).includes(req.body.type)) { sendBadParam(res, "Type not valid"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, { message: "User not found" }); return;
    }

    query(`SELECT * FROM country c WHERE c.id = ${req.body.id_country};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      if (!result.length) {
        sendNotFound(res, { message: "Country not found" }); return;
      }

      const home: Home = new Home({
        address: req.body.address,
        alias: req.body.alias || null,
        type: req.body.type,
        id_country: req.body.id_country
      })

      home.add((status: any, result: any) => {
        if (status != 201) {
          rollback(); controlResponse(status, res, result); return;
        }

        const userHome: UserHome = new UserHome({
          id_user: userId,
          id_home: result.insertId
        })

        userHome.add((status: any, result: any) => {
          if (status != 201) {
            rollback(); controlResponse(status, res, result); return;
          }

          commit(); sendOk(res, 201, { message: "Home added" });
        })
      })
    })
  })
}


/**
 * Delete a home from user
 * @route DELETE /user/:idUser/homes/:idHome
 * @group Home  
 * @param {string} id.body.required - Filed id_user of the user
 * @param {string} address.body.required - Filed address of the user
 * @param {string} alias.body - Filed alias of the user
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const deleteHomeFromUser: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.idUser)
  const homeId: Number = parseInt(req.params.idHome)

  if (!userId) { sendBadParam(res, "User ID not defined"); return; }
  if (!homeId) { sendBadParam(res, "Home ID not defined"); return; }
  startTransaction();

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, "User not found"); return;
    }

    query(`SELECT * FROM home h WHERE h.id = ${homeId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      if (!result.length) {
        sendNotFound(res, "Home not found"); return;
      }

      query(`SELECT * FROM user_home uh WHERE uh.id_user = ${userId} AND uh.id_home = ${homeId};`, (status: any, result: any) => {
        if (!status) {
          sendServerError(res); return;
        }

        if (!result.length) {
          sendForbidden(res); return;
        }

        startTransaction();
        deleteField("home", ["id"], [homeId.toString()], (status: any, result: any) => {
          if (!status) {
            sendServerError(res); return;
          }

          commit(); sendOk(res, 202, { message: "Home deleted" });
        })
      })
    })
  })
}


/**
 * Update info of a home from user
 * @route PUT /user/:idUser/homes/:idHome
 * @group Home  
 * @param {string} id.body.required - Filed id_user of the user
 * @param {string} address.body.required - Filed address of the user
 * @param {string} alias.body - Filed alias of the user
 * @returns {object} 201 - Created
 * @returns {object} 400 - Bad request
 * @returns {object} 401 - Unauthorized
 * @returns {object} 403 - Forbidden
 * @returns {object} 404 - Not found
 * @returns {object} 409 - Conflict
 * @returns {object} 500 - Internal server error
*/
export const updateInfoHomeFromUser: RequestHandler = async (req, res) => {
  const userId: Number = parseInt(req.params.idUser)
  const homeId: Number = parseInt(req.params.idHome)

  if (!userId) { sendBadParam(res, "User ID not defined"); return; }
  if (!homeId) { sendBadParam(res, "Home ID not defined"); return; }

  startTransaction();

  if (!req.body.address) { sendBadParam(res, "Address not defined"); return; }
  if (!req.body.type) { sendBadParam(res, "Type not defined"); return; }
  if (!req.body.id_country) { sendBadParam(res, "Country ID not defined"); return; }

  if (!Object.values(TypeHome).includes(req.body.type)) { sendBadParam(res, "Type not valid"); return; }

  query(`SELECT * FROM user u WHERE u.id = ${userId};`, (status: any, result: any) => {
    if (!status) {
      sendServerError(res); return;
    }

    if (!result.length) {
      sendNotFound(res, { message: "User not found" }); return;
    }

    query(`SELECT * FROM user_home uh WHERE uh.id_user = ${userId} AND uh.id_home = ${homeId};`, (status: any, result: any) => {
      if (!status) {
        sendServerError(res); return;
      }

      if (!result.length) {
        sendForbidden(res); return;
      }

      query(`SELECT * FROM country c WHERE c.id = ${req.body.id_country};`, (status: any, result: any) => {
        if (!status) {
          sendServerError(res); return;
        }

        if (!result.length) {
          sendNotFound(res, { message: "Country not found" }); return;
        }

        query(`UPDATE home SET address = '${req.body.address}', alias = '${req.body.alias}', type = '${req.body.type}', id_country = '${req.body.id_country}' WHERE id = ${homeId}`, (status: any, result: any) => {
          if (!status) {
            sendServerError(res); return;
          }

          sendOk(res, 202, { message: "Home updated" });
        })
      })
    })
  })
}