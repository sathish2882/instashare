import {Link} from 'react-router-dom'
import {BsHeart} from 'react-icons/bs'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import {FcLike} from 'react-icons/fc'

import './index.css'

const PostItem = props => {
  const {eachPost, onPostLike} = props
  const {userName, profilePic, postDetails, likesCount, postId} = eachPost

  const {createdAt, comments, message, userId} = eachPost

  console.log(userId)

  const updatedComments = comments.map(eachComment => ({
    userName: eachComment.user_name,
    userId: eachComment.user_id,
    comment: eachComment.comment,
  }))

  const isLiked = message === 'Post has been liked'

  const onLikeBtn = () => {
    onPostLike(postId, true)
  }

  const onUnLikeBtn = () => {
    onPostLike(postId, false)
  }

  return (
    <div testid="postItem" className="post">
      <div className="post-profile-container">
        <img
          className="post-profile"
          src={profilePic}
          alt="post author profile"
        />
        <Link className="link" to={`/users/${userId}`}>
          <p className="post-username">{userName}</p>
        </Link>
      </div>
      <img className="post-img" src={postDetails.imageUrl} alt="post" />
      <div className="post-buttons">
        {isLiked ? (
          <button
            onClick={onUnLikeBtn}
            className="post-btn"
            testid="unLikeIcon"
            type="button"
          >
            <FcLike className="post-icon" />
          </button>
        ) : (
          <button
            onClick={onLikeBtn}
            className="post-btn"
            testid="likeIcon"
            type="button"
          >
            <BsHeart className="post-unlike-icon" />
          </button>
        )}
        <button className="post-btn" type="button">
          <FaRegComment className="post-icon" />
        </button>
        <button className="post-btn" type="button">
          <BiShareAlt className="post-icon" />
        </button>
      </div>
      <p className="post-likes">{likesCount} likes</p>
      <p className="post-caption">{postDetails.caption}</p>
      <ul className="post-comment-list">
        {updatedComments.map(each => (
          <li className="post-list-item" key={each.userId}>
            <p className="post-comment">
              <span className="post-comment-username">{each.userName}</span>
              {each.comment}
            </p>
          </li>
        ))}
      </ul>
      <p className="post-created-at">{createdAt}</p>
    </div>
  )
}

export default PostItem
