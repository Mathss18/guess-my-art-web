"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "../helpers/cn";
import { imageService } from "../services/image.service";
import { useMutation } from "react-query";
import toast from "react-hot-toast";

enum ModeEnum {
  GUESS = "Guess",
  CREATE = "Create",
}

export default function Home() {
  const [id, setId] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [guessText, setGuessText] = useState("");
  const [percentage, setPercentage] = useState("0%");
  const [url, setUrl] = useState("/logo2.webp");
  const [endRound, setEndRound] = useState(false);
  const [exclude, setExclude] = useState<any>([]);
  const [mode, setMode] = useState(ModeEnum.GUESS);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    setExclude(JSON.parse(localStorage.getItem("exclude") ?? "[]"));
  }, []);

  const { mutate: getRandom, isLoading } = useMutation(imageService.getRandom, {
    onSuccess: (data) => {
      const { id, url, title } = data.data.data;
      if (id) {
        setId(id);
      }
      setUrl(url);
      setTitle(title);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: guess } = useMutation(imageService.guess, {
    onSuccess: (data) => {
      const calculatedPercentage = data.data.data.percentage;
      setPercentage(calculatedPercentage);
      setEndRound(true);
      setExclude([...exclude, id]);
      localStorage.setItem("exclude", JSON.stringify([...exclude, id]));
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const { mutate: create } = useMutation(imageService.create, {
    onSuccess: (data) => {
      const { imageUrl, userPrompt } = data.data.data;
      setUrl(imageUrl);
      setTitle(userPrompt);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const submit = () => {
    if (mode === ModeEnum.GUESS) {
      guess({ text: `${title} | ${guessText}` });
    } else {
      create({ text: guessText });
      setImageLoading(true);
    }
  };

  const nextArt = () => {
    getRandom({ exclude });
    setEndRound(false);
    setGuessText("");
  };

  const changeMode = () => {
    setMode(mode === ModeEnum.GUESS ? ModeEnum.CREATE : ModeEnum.GUESS);
  };

  useEffect(() => {
    getRandom({ exclude });
  }, []);

  useEffect(() => {
    setGuessText("");
  }, [mode]);

  return (
    <div className="flex min-h-screen flex-col items-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Guess My Art</h1>
      <button
        className={cn("btn btn-active w-full max-w-lg mb-2", mode === ModeEnum.GUESS ? "btn-primary" : "btn-accent")}
        disabled={imageLoading || isLoading}
        onClick={changeMode}
      >
        {`Your are in ${mode} Mode`}
      </button>
      <div className="rounded-md relative">
        <Image
          className={cn("rounded-lg", endRound ? "bg-black bg-opacity-50" : "")}
          src={url}
          alt="Art"
          width={512}
          height={512}
          onLoad={() => {
            setImageLoading(false);
          }}
        />
        {endRound && (
          <div className="absolute top-0 left-0 w-full h-full rounded-lg flex items-center justify-center bg-black bg-opacity-50">
            <div className="text-white text-3xl font-bold">You Got {percentage} Correct</div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center space-x-2 p-4 rounded-lg shadow-md max-w-lg w-full gap-2 mt-4 font-extrabold">
        <p className={cn("mt-2 mb-2", endRound ? "" : "blur-sm")}>{title}</p>
        <textarea
          onChange={(e) => setGuessText(e.target.value)}
          value={guessText}
          className="textarea textarea-info textarea-bordered textarea-lg w-full"
          placeholder={mode === ModeEnum.GUESS ? "🤔 How would you describe this art?" : "🎨 Describe your art"}
        ></textarea>
        {endRound ? (
          <button
            className={cn("btn w-full mt-4", mode === ModeEnum.GUESS ? "btn-primary" : "btn-accent")}
            onClick={nextArt}
          >
            Next Art
          </button>
        ) : (
          <>
            <button
              className={cn("btn", mode === ModeEnum.GUESS ? "btn-primary" : "btn-accent")}
              disabled={imageLoading || isLoading}
              onClick={submit}
            >
              {imageLoading && <span className="loading loading-spinner"></span>}
              {mode === ModeEnum.GUESS ? "Guess it!" : "Create it!"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
