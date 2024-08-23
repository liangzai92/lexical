import './index.scoped.scss'

const ArticleAuthor = () => {
  return (
    <div className='user-info'>
      <div className='user-avatar'>
        <img className='avatar-img' src="https://miro.medium.com/v2/resize:fill:88:88/1*J5nlHK-FENqXcx7CaT3gOA.jpeg" />
      </div>
      <div className='user-data'>
        <div>Author: Liangzai</div>
        <div>Time: 2021-08-15</div>
      </div>
    </div>
  )
}

export default ArticleAuthor;