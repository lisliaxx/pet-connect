import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";

const requireAuth = auth({
  issuerBaseURL: process.env.AUTH0_ISSUER,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  tokenSigningAlgs: "RS256",
});


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// Routes
app.get("/ping", (req, res) => {
  res.send("test ok");
});

app.get("/posts", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
  });
  res.json(posts);
});

app.post("/posts", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        auth0Id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: user.id,
      },
    });

    res.json(post);
  } catch (error) {
    console.error("Error creating the post:", error);
    res.status(500).json({ error: "Failed to create the post." });
  }
});


app.delete("/posts/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const deletedPost = await prisma.post.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(deletedPost);
});

app.get("/posts/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const post = await prisma.post.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(postItem);
});

app.put("/posts/:id", requireAuth, async (req, res) => {
  const id = req.params.id;
  const { title, content } = req.body;

  const updatedPost = await prisma.post.update({
    where: {
      id: parseInt(id),
    },
    data: {
      title,
      content,
    },
  });

  res.json(updatedPost);
});

app.get("/me", requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  res.json(user);
});

app.post('/pet-interactions', requireAuth, async (req, res) => {
  const { liked, name, age, gender, breed } = req.body;
  try {
      const user = await prisma.user.findUnique({ where: { auth0Id: req.auth.payload.sub } });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      const interaction = await prisma.petInteraction.create({
          data: {
              liked,
              name,
              age,
              gender,
              breed,
              authorId: user.id,
          }
      });

      res.json(interaction);
  } catch (error) {
      console.error("Error saving interaction:", error);
      res.status(500).json({ message: "Failed to record interaction", error: error.message });
  }
});


app.get('/pet-interactions', requireAuth, async (req, res) => {
  const auth0Id = req.auth.payload.sub;

  const user = await prisma.user.findUnique({
    where: { auth0Id }
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  const interactions = await prisma.petInteraction.findMany({
    where: { authorId: user.id, liked: true}
  });

  res.json(interactions);
});

app.post("/pets", requireAuth, async (req, res) => {
  const { name, gender, age, breed } = req.body;
  const auth0Id = req.auth.payload.sub;

  try {
    const user = await prisma.user.findUnique({
      where: { auth0Id }
    });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPet = await prisma.pet.create({
      data: {
        name,
        gender,
        age,
        breed,
        authorId: user.id
      }
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error adding new pet:", error);
    res.status(500).json({ message: "Failed to add new pet", error: error.message });
  }
});


app.get("/pets/:petId", requireAuth, async (req, res) => {
  const { petId } = req.params;

  try {
      const pet = await prisma.pet.findUnique({
          where: {
              id: parseInt(petId),
          },
      });

      if (pet) {
          res.json(pet);
      } else {
          res.status(404).json({ error: "Pet not found" });
      }
  } catch (error) {
      console.error("Error fetching pet details:", error);
      res.status(500).json({ error: "Failed to fetch pet details" });
  }
});


app.put("/pets/:petId", requireAuth, async (req, res) => {
  const { petId } = req.params;
  const { name, gender, age, breed } = req.body;

  try {
      const updatedPet = await prisma.pet.update({
          where: {
              id: parseInt(petId),
          },
          data: {
              name,
              gender,
              age,
              breed,
          },
      });

      res.json(updatedPet);
  } catch (error) {
      console.error("Error updating pet details:", error);
      res.status(500).json({ error: "Failed to update pet details" });
  }
});


app.post("/verify", requireAuth, async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const email = req.auth.payload[`${process.env.REACT_APP_AUTH0_AUDIENCE}/email`];
    const name = req.auth.payload[`${process.env.REACT_APP_AUTH0_AUDIENCE}/name`];
    console.log("Auth0 ID:", auth0Id);

    const user = await prisma.user.findUnique({
      where: { auth0Id, },
    });

    if (user) {
      res.json(user);
      console.log("User found:", user);
    } else {
      const newUser = await prisma.user.create({
       data: { email, auth0Id, name },
      });
      res.json(newUser);
    }
  } catch (error) {
    console.error("Error in /verify:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});