import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useTranslation } from "react-i18next";
import { COLORS, SHADOWS } from "../constants/theme";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello. How can I help you optimize your day?",
      isUser: false,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText("");

    // Kullanıcı mesajını ekle
    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: userText,
      isUser: true,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      // Groq API Çağrısı (Groq'un hızlı Llama3 veya Mixtral modelleri için uyarlanmıştır)
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192", // Groq'ta çalışan uygun bir model adı
            messages: [
              {
                role: "system",
                content:
                  "You are a professional, minimalist, and highly effective AI productivity coach. Keep your answers concise, actionable, and polite.",
              },
              { role: "user", content: userText },
            ],
          }),
        },
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.choices[0].message.content,
          isUser: false,
        };
        setMessages((prev) => [...prev, aiResponse]);
      } else {
        throw new Error("API yanıt vermedi veya model hatası oluştu.");
      }
    } catch (error) {
      console.error("API Hatası:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I am having trouble connecting right now. Please try again later.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("chat.coachName")}</Text>
      </View>

      <ScrollView
        style={styles.chatArea}
        contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                msg.isUser ? styles.userText : styles.aiText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
        {isTyping && (
          <View
            style={[
              styles.messageBubble,
              styles.aiBubble,
              { width: 60, alignItems: "center" },
            ]}
          >
            <ActivityIndicator size="small" color={COLORS.textSecondary} />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t("chat.placeholder")}
          placeholderTextColor={COLORS.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
          editable={!isTyping}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={isTyping}
        >
          <Text style={styles.sendButtonText}>{t("chat.send")}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  chatArea: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.accent,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  aiText: {
    color: COLORS.textPrimary,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 32 : 16,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginRight: 12,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
