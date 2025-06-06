import { GetServerSideProps } from 'next';
import { NotionPage } from '@/components/NotionPage';
import NotionViewTabs from '@/components/NotionViewTabs';
import { resolveNotionPage } from '@/lib/resolve-notion-page';
import { notionViews, viewPageIds } from '@/lib/notion-views';

// 各ビューのプロパティを取得
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const viewId = params?.view as string;
  const pageId = viewPageIds[viewId];

  if (!pageId) {
    // 該当するビューIDがない場合はエラー
    return {
      notFound: true
    };
  }

  try {
    // Notionページのデータを取得
    const props = await resolveNotionPage(pageId);
    return { 
      props
    };
  } catch (err) {
    console.error('page error', viewId, err);
    throw err;
  }
};

// ビュー別ページコンポーネント
export default function ViewPage(props) {
  return (
    <>
      <NotionViewTabs tabs={notionViews} />
      <NotionPage {...props} />
    </>
  );
}
