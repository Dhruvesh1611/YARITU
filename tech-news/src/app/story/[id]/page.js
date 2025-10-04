import {
  Container,
  Typography,
  Card,
  CardContent,
  Link as MuiLink,
} from "@mui/material";

export const dynamic = "force-dynamic"; // Force SSR

async function getStory(id) {
  const res = await fetch(`https://hn.algolia.com/api/v1/items/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function StoryPage({ params }) {
  const story = await getStory(params.id);

  if (!story) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Story not found.
        </Typography>
      </Container>
    );
  }

  const externalUrl = story.url || "http://codinggita.com/";
  const timeAgo = new Date(story.created_at).toLocaleString();

  return (
    <Container sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <MuiLink
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            variant="h5"
          >
            {story.title}
          </MuiLink>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {story.points} points • {story.author} • {timeAgo}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Comments
          </Typography>

          {story.children && story.children.length > 0 ? (
            story.children.slice(0, 3).map((comment) => (
              <Card key={comment.id} sx={{ mt: 1, bgcolor: "#f9f9f9" }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    {comment.text
                      ? comment.text.replace(/<[^>]+>/g, "")
                      : "No text"}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography>No comments available.</Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
