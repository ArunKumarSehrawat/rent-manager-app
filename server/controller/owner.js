import { Owner } from "../model/owner.js";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const getAllYears = async (req, res) => {
     try {
          const { years } = await Owner.findById(req.user.id, "years");
          return res.json({ years });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

export const deleteAllYears = async (req, res) => {
     try {
          await Owner.findByIdAndUpdate(req.user.id, { years: {} });
          return res.json({ message: "Years cleared", years: {} });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

export const getOneYear = async (req, res) => {
     try {
          const { year: getYear } = req.params;
          const { years } = await Owner.findById(req.user.id, "years." + getYear);

          return res.json({ [getYear]: years[getYear] });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

export const createOneYear = async (req, res) => {
     try {
          const { year: yearToBeCreated } = req.params;
          const { years } = await Owner.findById(req.user.id, "years");

          // if the requested year property already exists on the object then deny the creation of the said year
          if (years.hasOwnProperty(yearToBeCreated)) return res.json({ message: `Year ${yearToBeCreated} already exists`, [yearToBeCreated]: years[yearToBeCreated] });
          // else create the new year
          years[yearToBeCreated] = new Year(months, yearToBeCreated);
          await Owner.findByIdAndUpdate(req.user.id, { years: years });
          return res.json({ message: `Year ${yearToBeCreated} created`, [yearToBeCreated]: years[yearToBeCreated] });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

export const deleteOneYear = async (req, res) => {
     try {
          const { year: yearToDelete } = req.params;
          const { years } = await Owner.findById(req.user.id, "years");
          delete years[yearToDelete];

          await Owner.findByIdAndUpdate(req.user.id, { years: years });
          return res.json({ message: `Year ${yearToDelete} deleted` });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

export const updateOneYear = async (req, res) => {
     try {
          const { [req.params.year]: updatedYear } = req.body;
          const { year: yearToUpdate } = req.params;
          const query = `years.${yearToUpdate}`;
          await Owner.findByIdAndUpdate(req.user.id, { $set: { [query]: updatedYear } });
          return res.json({ message: `Year ${yearToUpdate} updated` });
     } catch (error) {
          console.log(error.message);
          return res.json({ message: "Something went wrong. Please try again later." });
     }
};

function Year(months, year) {
     this.yearlyTotal = 0;
     this.year = year;
     for (const month of months) this[month] = new Month();
}

function Month() {
     this.monthlyTotal = 0;
     this.space = {};
}
