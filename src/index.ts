import app from './App'

const port = process.env.PORT || 3000

// Handle 404 error
app.use(function (req, res, next) {
  return res.status(404).send({ status: "404", message: "Api doesn't exists" });
});

// Handle 500 error
app.use(function (err, req, res, next) {
  return res
    .status(500)
    .send({ status: "404", message: "Server Error", error: err });
});

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})