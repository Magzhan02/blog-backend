import PostSchema from '../models/Post.js';

export const createPost = async (request, resp) => {
  try {
    // создаем  статью
    const doc = new PostSchema({
      title: request.body.title,
      text: request.body.text,
      tags: request.body.tags,
      image: request.body.image,
      user: request.userId,
    });
    // сохраняем статью на mongoDB
    const post = await doc.save();

    resp.json(post);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to create post',
    });
  }
};

//получаем все статьи
export const getAllPosts = async (request, resp) => {
  try {
    // получаем все статьи и имя пользователя
    const allPosts = await PostSchema.find().populate('user').exec();

    resp.json(allPosts);
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to get posts',
    });
  }
};
// получаем статью по id
export const getPost = async (request, resp) => {
  try {
    const postId = request.params.id;

    PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return resp.status(500).json({
            message: 'failed to get post',
          });
        }

        if (!doc) {
          return resp.status(400).json({
            message: 'failed to get post',
          });
        }
        resp.json(doc);
      },
    );
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to get post',
    });
  }
};

// удаляем статью по id
export const deletePost = async (request, resp) => {
  try {
    const postId = request.params.id;

    PostSchema.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error) {
          console.log(error);
          return resp.status(500).json({
            message: 'failed to delete post',
          });
        }

        if (!doc) {
          return resp.status(404).json({
            message: 'failed to delete post',
          });
        }
        resp.json({ success: true });
      },
    );
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to delete post',
    });
  }
};

export const editPost = async (request, resp) => {
  try {
    const postId = request.params.id;

    await PostSchema.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        title: request.body.title,
        text: request.body.text,
        tags: request.body.tags,
        image: request.body.image,
        user: request.userId,
      },
    );

    resp.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).json({
      message: 'failed to edit post',
    });
  }
};
