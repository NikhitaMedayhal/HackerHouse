import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const appUrl = process.env.APP_URL || "http://localhost:3000";
  const imageUrl = `${appUrl}/api/passport/${id}`;
  const pageUrl = `${appUrl}/share/${id}`;

  const title = "Hacker House Goa 2026 — Builder Passport";
  const description = "Check out this Builder Passport for Hacker House Goa 2026!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { id } = await params;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B6B3A",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px 20px",
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            background: "#f7c948",
            border: "4px solid black",
            padding: "20px",
            boxShadow: "6px 6px 0 black",
          }}
        >
          <h1
            style={{
              fontSize: "18px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            HACKER HOUSE
          </h1>

          <div
            style={{
              color: "#ff4f9a",
              fontSize: "14px",
              marginTop: "8px",
            }}
          >
            GOA • 2026
          </div>
        </div>

        {/* PASSPORT */}

        <div
          style={{
            marginTop: "30px",
            background: "#0B6B3A",
            border: "4px solid #0B6B3A",
            padding: "15px",
            boxShadow: "6px 6px 0 black",
          }}
        >
          
          {/* TEMPORARY IMAGE */}
          <Image
            src={`/api/passport/${id}`}
            alt="Hacker House Goa Builder Passport"
            width={800}
            height={1000}
            priority
            style={{
              width: "100%",
              maxWidth: "420px",
              height: "auto",
              display: "block",
              margin: "0 auto",
              border: "3px solid black",
            }}
            sizes="(max-width: 420px) 100vw, 420px"
          />

        </div>

        {/* CTA */}

        <Link
          href="/builder"
          style={{
            display: "block",
            marginTop: "30px",
            padding: "15px",
            background: "#f7c948",
            color: "black",
            border: "4px solid black",
            boxShadow: "5px 5px 0 black",
            textDecoration: "none",
            fontSize: "10px",
            lineHeight: 1.6,
          }}
        >
          🏝️ GET YOUR OWN BUILDER CARD, SHOW EVERYONE WHO YOU ARE
        </Link>

        <Link
          href="/"
          style={{
            display: "block",
            marginTop: "18px",
            padding: "10px",
            color: "#ffe58a",
            textDecoration: "none",
            fontSize: "12px",
          }}
        >
          ← BACK TO HACKER HOUSE GOA
        </Link>

        <p
          style={{
            marginTop: "30px",
            color: "#ffe58a",
            fontSize: "10px",
            lineHeight: 1.8,
          }}
        >
          HUMANS RULE. WE PLAY.
        </p>
      </div>
    </main>
  );
}