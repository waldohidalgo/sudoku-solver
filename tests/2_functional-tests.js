const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  const onePuzzleValid =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const onePuzzleSolved =
    "135762984946381257728459613694517832812936745357824196473298561581673429269145378";
  const onePuzzleInvalidCharacter =
    "p.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  const onePuzzleNot81Characters =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.7";
  const onePuzzleCannotBeSolved =
    "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

  // Solve a puzzle with valid puzzle string: POST request to /api/solve

  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle: onePuzzleValid,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, onePuzzleSolved);
        done();
      });
  });

  // Solve a puzzle with missing puzzle string: POST request to /api/solve

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle: "",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  // Solve a puzzle with invalid characters: POST request to /api/solve

  test("Solve a puzzle with invalid characters: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle: onePuzzleInvalidCharacter,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  // Solve a puzzle with incorrect length: POST request to /api/solve

  test("Solve a puzzle with incorrect length: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle: onePuzzleNot81Characters,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  // Solve a puzzle that cannot be solved: POST request to /api/solve

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/solve")
      .send({
        puzzle: onePuzzleCannotBeSolved,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  // Check a puzzle placement with all fields: POST request to /api/check

  test("Check a puzzle placement with all fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "a1",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  // Check a puzzle placement with single placement conflict: POST request to /api/check

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "a2",
        value: "4",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 1);
        assert.equal(res.body.conflict[0], "row");
        done();
      });
  });

  // Check a puzzle placement with multiple placement conflicts: POST request to /api/check

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "a2",
        value: "1",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 2);
      });
    done();
  });

  // Check a puzzle placement with all placement conflicts: POST request to /api/check

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "a2",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.equal(res.body.conflict.length, 3);
      });
    done();
  });
  // Check a puzzle placement with missing required fields: POST request to /api/check

  test("Check a puzzle placement with missing required fields: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  // Check a puzzle placement with invalid characters: POST request to /api/check

  test("Check a puzzle placement with invalid characters: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleInvalidCharacter,
        coordinate: "a2",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  // Check a puzzle placement with incorrect length: POST request to /api/check

  test("Check a puzzle placement with incorrect length: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleNot81Characters,
        coordinate: "a2",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          "Expected puzzle to be 81 characters long"
        );
        done();
      });
  });

  // Check a puzzle placement with invalid placement coordinate: POST request to /api/check

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "ap9",
        value: "2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  // Check a puzzle placement with invalid placement value: POST request to /api/check

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", (done) => {
    chai
      .request(server)
      .keepOpen()
      .post("/api/check")
      .send({
        puzzle: onePuzzleValid,
        coordinate: "a2",
        value: "10",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});
