import { useEffect } from 'react';

/**
 * What's Newセクションのスタイリングを行うためのユーティリティコンポーネント
 * Notionページレンダリング後にDOMにアクセスして特定の要素にクラスを追加します
 */
const WhatsNewStyling = () => {
  useEffect(() => {
    // ページのレンダリング後に実行
    const applyWhatsNewStyling = () => {
      try {
        // What's Newセクションのタイトルを探す（タイトルがWhat's Newとなっているコレクションを探す）
        const collectionTitles = document.querySelectorAll('.notion-collection-header-title');
        
        collectionTitles.forEach((titleElement) => {
          if (titleElement.textContent?.includes("What") && titleElement.textContent?.includes("New")) {
            // What's Newセクションを特定
            console.log('Found What\'s New section, applying styles...');
            
            // 親のコレクション要素を取得
            const collectionElement = titleElement.closest('.notion-collection');
            
            if (collectionElement) {
              // カスタムクラスを追加
              collectionElement.classList.add('whats-new-collection');
              
              // カード内のタイトル要素を小さくする
              const cardTitles = collectionElement.querySelectorAll('.notion-collection-card-property-title');
              cardTitles.forEach(title => {
                title.classList.add('whats-new-title');
              });
              
              // カテゴリプロパティのスタイリング（select系のプロパティ）
              const categoryProps = collectionElement.querySelectorAll('.notion-property-select');
              categoryProps.forEach(category => {
                category.classList.add('whats-new-category');
              });
              
              // 日付プロパティのスタイリング
              const dateProps = collectionElement.querySelectorAll('.notion-property-date');
              dateProps.forEach(date => {
                date.classList.add('whats-new-date');
              });
            }
          }
        });
      } catch (err) {
        console.error('Error applying What\'s New styling:', err);
      }
    };

    // DOMが完全に読み込まれた後に実行
    // 初回実行
    setTimeout(applyWhatsNewStyling, 1000);
    
    // Notionコンテンツが動的に変更される可能性があるため、再度実行
    const intervalId = setInterval(applyWhatsNewStyling, 3000);
    
    // クリーンアップ関数
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // このコンポーネントは実際のUIをレンダリングしない
  return null;
};

export default WhatsNewStyling;