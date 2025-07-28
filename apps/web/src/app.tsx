import { useState } from 'react'
import { useListPosts, useGetPost, useCreatePost, useUpdatePost, useDeletePost } from './api/posts'

const App = () => {
  const [selectedPostId, setSelectedPostId] = useState<string>('')
  const [newPost, setNewPost] = useState({ title: '', description: '' })
  const [editPost, setEditPost] = useState({
    id: '',
    title: '',
    description: '',
  })

  // Hooks
  const listPostsQuery = useListPosts()
  const getPostQuery = useGetPost(selectedPostId)
  const createPostMutation = useCreatePost()
  const updatePostMutation = useUpdatePost()
  const deletePostMutation = useDeletePost()

  const handleCreatePost = () => {
    if (newPost.title && newPost.description) {
      createPostMutation.mutate(newPost, {
        onSuccess: () => {
          setNewPost({ title: '', description: '' })
        },
      })
    }
  }

  const handleUpdatePost = () => {
    if (editPost.id && editPost.title && editPost.description) {
      updatePostMutation.mutate(editPost, {
        onSuccess: () => {
          setEditPost({ id: '', title: '', description: '' })
        },
      })
    }
  }

  const handleDeletePost = (id: string) => {
    deletePostMutation.mutate({ id })
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header>
        <h1>oRPC Posts Demo</h1>
      </header>

      {/* List Posts Section */}
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>All Posts (listPosts)</h2>
        <button onClick={() => listPostsQuery.refetch()}>Refresh List</button>

        {listPostsQuery.isLoading && <p>Loading posts...</p>}
        {listPostsQuery.error && <p>Error: {listPostsQuery.error.message}</p>}

        {listPostsQuery.data && (
          <div style={{ marginTop: '10px' }}>
            {listPostsQuery.data.map((post) => (
              <div
                key={post.id}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  borderRadius: '4px',
                }}
              >
                <strong>{post.title}</strong> (ID: {post.id})
                <div style={{ marginTop: '5px' }}>
                  <button
                    onClick={() => setSelectedPostId(post.id)}
                    style={{ marginRight: '5px' }}
                  >
                    View Details
                  </button>
                    <button
                    onClick={() => setEditPost({
                      id: post.id,
                      title: post.title,
                      description: post.description || ''
                    })}
                    style={{ marginRight: '5px' }}
                    >
                    Edit
                    </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    disabled={deletePostMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Get Single Post Section */}
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>Get Post Details (getPost)</h2>
        <input
          type="text"
          placeholder="Enter post ID"
          value={selectedPostId}
          onChange={(e) => setSelectedPostId(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />

        {selectedPostId && getPostQuery.isLoading && (
          <p>Loading post details...</p>
        )}
        {selectedPostId && getPostQuery.error && (
          <p style={{ color: 'red' }}>Error: {getPostQuery.error.message}</p>
        )}
        {selectedPostId && !getPostQuery.data && !getPostQuery.isLoading && !getPostQuery.error && (
          <p style={{ color: 'gray' }}>Enter a post ID to view details</p>
        )}

        {selectedPostId && getPostQuery.data && (
          <div
            style={{
              marginTop: '10px',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <h3>{getPostQuery.data.title}</h3>
            <p>ID: {getPostQuery.data.id}</p>
            <p>Description: {getPostQuery.data.description}</p>
          </div>
        )}
      </section>

      {/* Create Post Section */}
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>Create New Post (createPost)</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px',
          }}
        >
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            style={{ padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={newPost.description}
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
            style={{ padding: '5px' }}
          />
          <button
            onClick={handleCreatePost}
            disabled={
              createPostMutation.isPending ||
              !newPost.title ||
              !newPost.description
            }
          >
            {createPostMutation.isPending ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </section>

      {/* Update Post Section */}
      <section
        style={{
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <h2>Update Post (updatePost)</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            maxWidth: '400px',
          }}
        >
          <input
            type="text"
            placeholder="Post ID"
            value={editPost.id}
            onChange={(e) => setEditPost({ ...editPost, id: e.target.value })}
            style={{ padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Title"
            value={editPost.title}
            onChange={(e) =>
              setEditPost({ ...editPost, title: e.target.value })
            }
            style={{ padding: '5px' }}
          />
          <input
            type="text"
            placeholder="Description"
            value={editPost.description}
            onChange={(e) =>
              setEditPost({ ...editPost, description: e.target.value })
            }
            style={{ padding: '5px' }}
          />
          <button
            onClick={handleUpdatePost}
            disabled={
              updatePostMutation.isPending ||
              !editPost.id ||
              !editPost.title ||
              !editPost.description
            }
          >
            {updatePostMutation.isPending ? 'Updating...' : 'Update Post'}
          </button>
        </div>
      </section>

      {/* Status Messages */}
      {createPostMutation.isSuccess && (
        <div
          style={{
            padding: '10px',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          Post created successfully!
        </div>
      )}
      {updatePostMutation.isSuccess && (
        <div
          style={{
            padding: '10px',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          Post updated successfully!
        </div>
      )}
      {deletePostMutation.isSuccess && (
        <div
          style={{
            padding: '10px',
            color: '#155724',
            borderRadius: '4px',
            marginBottom: '10px',
          }}
        >
          Post deleted successfully!
        </div>
      )}
    </div>
  )
}

export default App
