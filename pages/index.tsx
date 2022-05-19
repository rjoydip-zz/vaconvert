import Head from "next/head";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { NextPage } from "next";
import { Container, Card, Text, Button, Input, Grid, useInput, Spacer, Loading } from "@nextui-org/react";
import styles from "../styles/Home.module.css";
import { AUDIO_EXT, isValidURL } from "../utils";

const Home: NextPage = () => {
  const [mp3, setMp3] = useState<Blob>();
  const [loading, setLoading] = useState<Boolean>(false);
  const { value, reset, bindings } = useInput("");

  const helper: {
    text: string,
    isValid: boolean
  } = useMemo(() => {
    if (!value)
      return {
        text: "",
        isValid: true
      };
    const isValid = isValidURL(value);
    return {
      text: isValid ? "Correct URL" : "Enter a valid url",
      isValid: !!isValid
    };
  }, [value]);

  const getMp3File = async (url: string) => {
    reset();
    setMp3(undefined);
    setLoading(true);
    setMp3(await (await fetch(`/api/v1?url=${url.trim()}`)).blob());
    setLoading(false);
  }

  const downloadMp3File = (blob: Blob) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `download-${+new Date()}.${AUDIO_EXT}`;
    link.click();
    link.remove();
    setMp3(undefined);
  }

  return (
    <>
      <Head>
        <title></title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container fluid css={{
        marginTop: 40
      }}>
        <Card cover css={{ w: "100%", h: "80vh" }}>
          <Card.Header css={{ top: 5 }}>
            <Grid.Container>
              <Grid xs={3}></Grid>
              <Grid xs={6} justify="center" alignItems="center">
                <Text size={48} weight="bold">
                  VAconverT
                </Text>
              </Grid>
              <Grid xs={3}></Grid>
            </Grid.Container>
          </Card.Header>
          <Card.Body>
            <Grid.Container>
              <Spacer x={1} />
              <Grid xs={11}>
                <Input
                  id="url"
                  aria-label="url"
                  placeholder="Provide a video URL"
                  css={{
                    marginTop: 3
                  }}
                  bordered={true}
                  animated={false}
                  fullWidth={true}
                  shadow={false}
                  {...bindings}
                  clearable
                  onClearClick={reset}
                  status={value == "" ? "default" : !helper.isValid ? "error" : "success"}
                  color={value == "" ? "default" : !helper.isValid ? "error" : "success"}
                  helperColor={value == "" ? "default" : !helper.isValid ? "error" : "success"}
                  helperText={helper.text}
                  contentRight={
                    <Button
                      flat
                      auto
                      rounded
                      color="primary"
                      onPress={() => value && getMp3File(value)}
                      disabled={value === "" || !helper.isValid}>
                      <Text
                        css={{ color: "inherit" }}
                        size={12}
                        weight="bold"
                        transform="uppercase"
                      >
                        Convert
                      </Text>
                    </Button>
                  }
                />
              </Grid>
            </Grid.Container>
          </Card.Body>
          <Card.Footer>
            <Grid.Container>
              <Grid xs={5.5}></Grid>
              <Grid xs={1}>
                {loading ? <><Spacer x={2} /><Loading color="primary" /></> :
                  <Button
                    flat
                    auto
                    rounded
                    color="primary"
                    onPress={() => mp3 && downloadMp3File(mp3)}>
                    <Text
                      css={{ color: "inherit" }}
                      size={12}
                      weight="bold"
                      transform="uppercase"
                    >
                      Download
                    </Text>
                  </Button>}
              </Grid>
              <Grid xs={5.5}></Grid>
            </Grid.Container>
          </Card.Footer>
        </Card>
      </Container>

      <footer className={styles.footer}>
        <Text>
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </Text>
      </footer>
    </>
  );
};

export default Home;
