import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { COLORS, SHADOWS } from "../constants/theme";

interface Insight {
  id: string;
  title: string;
  description: string;
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Veri çekme hatası:", error);
    } else if (data) {
      setInsights(data);
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{t("dashboard.greeting")}</Text>
        <Text style={styles.subtitle}>{t("dashboard.subtitle")}</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.accent}
          style={{ marginTop: 40 }}
        />
      ) : (
        <View style={styles.cardsContainer}>
          {insights.map((insight) => (
            <View key={insight.id} style={styles.card}>
              <Text style={styles.cardTitle}>{insight.title}</Text>
              <Text style={styles.cardDescription}>{insight.description}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  greeting: {
    fontSize: 34,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 24,
    borderRadius: 20,
    ...SHADOWS.sm,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
