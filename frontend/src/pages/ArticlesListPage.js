import articles from './article-content'
import ArticlesList from '../components/ArticlesList';

const ArticlesListPage = () => {
  return (
    <>
      <ArticlesList articles={articles} />
    </>
  );
}

export default ArticlesListPage;