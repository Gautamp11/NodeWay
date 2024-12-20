const express = require('express');
const fs = require('fs');

const app = express();

//middleware -> parsing incoming json data to http request format
app.use(express.json());

//custom middleware -> express will know below is middleware because of the parameters we have passed
app.use((req, res, next) => {
  console.log('Going through middleware');
  //dont forget to use next otherwise we will be stuck with this middleware
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf8')
);

// Function to get all tours
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

// Function to get a single tour by ID
const getTourById = (req, res) => {
  const tourId = parseInt(req.params.id);
  if (tourId > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  const tour = tours.find((tour) => tour.id === tourId);
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

// Function to add a new tour
const addTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error writing data to file',
        });
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// Function to update a tour
const updateTour = (req, res) => {
  const tourId = parseInt(req.params.id);
  const tour = tours.find((tour) => tour.id === tourId);
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  // Update tour properties here...

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error writing data to file',
        });
      }
      res.status(200).json({
        status: 'success',
        data: {
          tour: 'Updated tour successfully',
        },
      });
    }
  );
};

// Function to delete a tour
const deleteTour = (req, res) => {
  const tourId = parseInt(req.params.id);
  const tourIndex = tours.findIndex((tour) => tour.id === tourId);
  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  const deletedTour = tours[tourIndex];
  tours.splice(tourIndex, 1);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'fail',
          message: 'Error writing data to file',
        });
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};

// Function to get all users
const getAllUsers = (req, res) => {
  // Fetch users from the database or any other data source
  const users = []; // Replace this with actual data

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users: users,
    },
  });
};

// Function to get a single user by ID
const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  // Fetch user from the database or any other data source
  const user = {}; // Replace this with actual data

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'User not found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

// Function to add a new user
const addUser = (req, res) => {
  const newUser = req.body;
  // Add new user to the database or any other data source

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};

// Function to update a user
const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;
  // Update user in the database or any other data source

  res.status(200).json({
    status: 'success',
    data: {
      user: 'Updated user successfully',
    },
  });
};

// Function to delete a user
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  // Delete user from the database or any other data source

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// Modified the callbacks to their own functions
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', addTour);
// app.get('/api/v1/tours/:id', getTourById);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// But we can do much better by using app.route and chaining

app.route('/api/v1/tours').get(getAllTours).post(addTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(addUser);

app
  .route('/api/v1/users/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
