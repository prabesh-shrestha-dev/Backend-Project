const Employee = require('../model/Employee');

const getAllEmployees = async (req, res) => {
  const employees = await Employee.find().exec();
  if (!employees) return res.status(204).json({ 'message': 'No employees found.' })
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;

  if (!firstname || !lastname) {
    return res.status(400).json({ 'message': 'First and last names are required.' });
  }

  try {
  const result = await Employee.create({ firstname, lastname });
  res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ 'message': 'ID parameter is required.' });
  }

  const updateFields = {};

  if (req.body?.firstname) updateFields.firstname = req.body.firstname;
  if (req.body?.lastname) updateFields.lastname = req.body.lastname;

  const updatedEmployee = await Employee.findOneAndUpdate(
    { _id: req.body.id },
    updateFields,
    { returnDocument: 'after' }
  ).exec();

  if (!updatedEmployee) {
    return res.status(404).json({ "message": `No employee matches ID ${req.body.id}.` });
  }
  
  res.json(updatedEmployee);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

  const deletedEmployee = await Employee.findOneAndDelete(
    { _id: req.body.id }
  ).exec();

  if (!deletedEmployee) {
    return res.status(404).json({ "message": `No employee matches ID ${req.body.id}.` });
  }

  res.json(deletedEmployee);
};

const getEmployee = async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' });

  const employee = await Employee.findOne({
    _id: req.params.id
  }).exec()
  if (!employee) {
    return res.status(404).json({ "message": `No employee matches ID ${req.params.id}.` });
  }
  res.json(employee);
};

module.exports = { getAllEmployees, createNewEmployee, updateEmployee, deleteEmployee, getEmployee };