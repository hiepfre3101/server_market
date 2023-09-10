import { Router } from 'express'
import { createMenu, getAllMenu, getOneMenu, removeMenu, updateMenu } from '../controller/menu'
import { responseSender } from '../middleware/configResponse';
const Menurouter = Router()

Menurouter.get('/menu', getAllMenu, responseSender)
Menurouter.get('/menu/:id', getOneMenu, responseSender)
Menurouter.post('/menu', createMenu, responseSender)
Menurouter.patch('/menu/:id', updateMenu, responseSender)
Menurouter.delete('/menu/:id', removeMenu, responseSender)

export default Menurouter
