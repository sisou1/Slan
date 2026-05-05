<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import {
  createActivity,
  fetchActivities,
  fetchParticipants,
  joinActivity,
} from "./api/activityApi";
import type { Activity, Participant } from "./types";

const activities = ref<Activity[]>([]);
const participantsByActivity = reactive<Record<number, Participant[]>>({});
const loadingActivities = ref(false);
const loadingParticipants = reactive<Record<number, boolean>>({});
const errorMessage = ref("");
const successMessage = ref("");

const createForm = reactive({
  name: "",
  description: "",
});

const joinForms = reactive<Record<number, { nickname: string }>>({});

const hasActivities = computed(() => activities.value.length > 0);

async function loadActivities() {
  loadingActivities.value = true;
  errorMessage.value = "";
  try {
    const data = await fetchActivities();
    activities.value = data;
    data.forEach((activity) => {
      if (!joinForms[activity.id]) {
        joinForms[activity.id] = { nickname: "" };
      }
    });
  } catch (error) {
    errorMessage.value = "Impossible de charger les activités.";
  } finally {
    loadingActivities.value = false;
  }
}

async function handleCreateActivity() {
  if (!createForm.name.trim()) {
    errorMessage.value = "Le nom de l'activité est obligatoire.";
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";

  try {
    await createActivity({
      name: createForm.name.trim(),
      description: createForm.description.trim() || null,
    });
    createForm.name = "";
    createForm.description = "";
    successMessage.value = "Activité créée.";
    await loadActivities();
  } catch (error) {
    errorMessage.value = "Impossible de créer l'activité.";
  }
}

async function handleLoadParticipants(activityId: number) {
  loadingParticipants[activityId] = true;
  errorMessage.value = "";
  try {
    participantsByActivity[activityId] = await fetchParticipants(activityId);
  } catch (error) {
    errorMessage.value = "Impossible de charger les participants.";
  } finally {
    loadingParticipants[activityId] = false;
  }
}

async function handleJoin(activityId: number) {
  const nickname = joinForms[activityId]?.nickname?.trim();
  if (!nickname) {
    errorMessage.value = "Le pseudo est obligatoire.";
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";

  try {
    await joinActivity(activityId, { nickname });
    joinForms[activityId].nickname = "";
    successMessage.value = "Participation enregistrée.";
    await Promise.all([loadActivities(), handleLoadParticipants(activityId)]);
  } catch (error) {
    errorMessage.value = "Impossible de rejoindre cette activité.";
  }
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("fr-FR");
}

onMounted(loadActivities);
</script>

<template>
  <main class="page">
    <section class="panel">
      <h1>Mini-tournois</h1>
      <form class="create-form" @submit.prevent="handleCreateActivity">
        <input
          v-model="createForm.name"
          type="text"
          placeholder="Nom du tournoi"
          maxlength="120"
          required
        />
        <input
          v-model="createForm.description"
          type="text"
          placeholder="Description (optionnelle)"
          maxlength="220"
        />
        <button type="submit">Créer</button>
      </form>
      <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="feedback success">{{ successMessage }}</p>
    </section>

    <section class="panel">
      <header class="list-header">
        <h2>Activités</h2>
        <button type="button" @click="loadActivities" :disabled="loadingActivities">
          {{ loadingActivities ? "Chargement..." : "Rafraîchir" }}
        </button>
      </header>

      <p v-if="loadingActivities">Chargement des activités...</p>
      <p v-else-if="!hasActivities">Aucune activité pour le moment.</p>

      <ul v-else class="activity-list">
        <li v-for="activity in activities" :key="activity.id" class="activity-card">
          <div class="activity-header">
            <h3>{{ activity.name }}</h3>
            <span>{{ activity.participants_count }} participant(s)</span>
          </div>
          <p class="description">{{ activity.description || "Sans description" }}</p>
          <p class="meta">Créée le {{ formatDate(activity.created_at) }}</p>

          <form class="join-form" @submit.prevent="handleJoin(activity.id)">
            <input
              v-model="joinForms[activity.id].nickname"
              type="text"
              placeholder="Ton pseudo"
              maxlength="60"
              required
            />
            <button type="submit">Rejoindre</button>
          </form>

          <div class="participants-actions">
            <button
              type="button"
              @click="handleLoadParticipants(activity.id)"
              :disabled="loadingParticipants[activity.id]"
            >
              {{ loadingParticipants[activity.id] ? "Chargement..." : "Voir participants" }}
            </button>
          </div>

          <ul v-if="participantsByActivity[activity.id]" class="participants-list">
            <li v-for="participant in participantsByActivity[activity.id]" :key="participant.id">
              {{ participant.nickname }} - {{ formatDate(participant.joined_at) }}
            </li>
          </ul>
        </li>
      </ul>
    </section>
  </main>
</template>
