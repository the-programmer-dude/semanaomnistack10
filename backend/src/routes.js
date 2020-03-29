const { Router } = require("express")
const devControl = require("./controllers/DevController")
const SearchControl = require("./controllers/SearchController")

const router = Router()

router.get("/devs", devControl.index)
router.post("/devs", devControl.store)

router.get("/search", SearchControl.index)
router.delete("/devs/:github_username", SearchControl.destroy)

module.exports = router