import { Container, Typography, Card, CardContent, Link as MuiLink } from "@mui/material";
import Link from "next/link";

export const revalidate = 600; // ISR: re-generate every 10 min

async function getTopNews() {
  const res = await fetch(
    "https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=10"
  );
  if (!res.ok) throw new Error("Failed to fetch top news");
  return res.json();
}

export default async function TopNewsPage() {
  const data = await getTopNews();
  const stories = data.hits;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📰 Top 10 Tech News
      </Typography>

      {stories.map((story) => {
        const externalUrl = story.url || "http://codinggita.com/";
        const timeAgo = new Date(story.created_at).toLocaleString();

        return (
          <Card key={story.objectID} sx={{ mb: 2 }}>
            <CardContent>
              <MuiLink
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                variant="h6"
              >
                {story.title}
              </MuiLink>

              <Typography variant="body2" color="text.secondary">
                {story.points} points • {story.author} • {timeAgo}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1 }}>
                <Link href={`/story/${story.objectID}`}>Read details</Link>
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Container>
  );
}
