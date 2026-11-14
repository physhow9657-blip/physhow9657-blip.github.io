/** 공개 글 판정: draft 가 아니고 발행일이 지났을 때만 배포합니다(로컬 dev 에서는 모두 표시).
 *  예약 발행: pubDate 를 미래 날짜로 두면 그 날짜 이후 빌드부터 공개됩니다(워크플로가 매일 빌드). */
export const isPublished = ({ data }: { data: { draft?: boolean; pubDate: Date } }) =>
  import.meta.env.PROD ? !data.draft && data.pubDate.valueOf() <= Date.now() : true;
