"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link,
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { GithubIcon } from "lucide-react";

import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

const useCountdown = (targetDate: string) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    setCountDown(countDownDate - new Date().getTime());
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [days, hours, minutes, seconds] = useCountdown(
    "2024-12-07T00:00:00+11:00",
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [quote, setQuote] = useState({ text: "", author: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRandomQuote = async () => {
    try {
      const response = await fetch("/api/quotes");
      const quotes = await response.json();
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

      setQuote({ text: randomQuote.en, author: randomQuote.author });
    } catch (error) {
      console.error("Error fetching quote:", error);
      setQuote({ text: "Failed to fetch quote", author: "Error" });
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRandomQuote();
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-200 dark:from-gray-900 dark:to-black overflow-hidden relative text-gray-900 dark:text-gray-100">
      <div className="absolute top-4 left-4 text-sm md:text-base">
        <Tooltip content="View source on GitHub" placement="bottom">
          <Link
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
          >
            <GithubIcon size={20} />
            <span>made by woflydev</span>
          </Link>
        </Tooltip>
      </div>
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      <div className="w-full max-w-6xl mx-auto px-4 py-12 backdrop-blur-xl bg-white/30 dark:bg-black/30 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-800/50">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          Australian National Championships
        </h1>
        <p className="text-xl md:text-2xl text-center mb-12 text-gray-700 dark:text-gray-300">
          Countdown to December 7, 2024
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 text-center mb-12">
          {[
            { label: "Days", value: days },
            { label: "Hours", value: hours },
            { label: "Minutes", value: minutes },
            { label: "Seconds", value: seconds },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center mb-8">
              <div className="text-8xl md:text-8xl lg:text-9xl font-bold mb-4 h-48 w-48 lg:h-48 flex items-center justify-center overflow-hidden bg-white/50 dark:bg-gray-800/30 rounded-3xl shadow-lg backdrop-blur-md border border-white/50 dark:border-gray-700/50">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={item.value}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400"
                    exit={{ y: -20, opacity: 0 }}
                    initial={{ y: 20, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 1,
                    }}
                  >
                    {item.value.toString().padStart(2, "0")}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          <Button
            className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-900 text-white dark:from-gray-300 dark:to-gray-100 dark:text-gray-900 hover:opacity-90 transition-opacity shadow-md backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
            size="lg"
            onPress={onOpen}
          >
            Random Quote
          </Button>
          <Button
            as={Link}
            className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-700 text-white dark:from-gray-100 dark:to-gray-300 dark:text-gray-900 hover:opacity-90 transition-opacity shadow-md backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
            href="https://ftcscout.org/events/2024/AUCMP/matches"
            rel="noopener noreferrer"
            size="lg"
            target="_blank"
          >
            Learn More
          </Button>
        </div>
      </div>
      <Modal
        classNames={{
          base: "bg-white dark:bg-gray-900 backdrop-blur-xl border border-white/50 dark:border-gray-800/50",
          backdrop: "opaque",
          header: "border-b border-gray-200/50 dark:border-gray-700/50",
          body: "py-6",
          footer: "border-t border-gray-200/50 dark:border-gray-700/50",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-gray-900 dark:text-gray-100">
                Why are you still here?
              </ModalHeader>
              <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <ModalBody>
                  <p className="text-gray-800 dark:text-gray-200">
                    {quote.text}
                  </p>
                  <p className="text-right text-gray-600 dark:text-gray-400 mt-4">
                    - {quote.author}
                  </p>
                </ModalBody>
              </motion.div>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
