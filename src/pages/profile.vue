<script setup>
import {useRouter} from "vue-router";
import {ArrowLeft, Coins, Crown, Trophy,} from "lucide-vue-next";
import {inject, ref, watch} from "vue";
import {toast} from "vue-sonner";
import {useAuthStore} from "@/stores/auth.js";
import {useAPIStore} from "@/stores/api.js";
import {useFileDialog} from "@vueuse/core";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {storeToRefs} from "pinia";

const predefinedAvatars = [
  new URL("@/assets/avatars/avatar1.png", import.meta.url).href,
  new URL("@/assets/avatars/avatar2.png", import.meta.url).href,
  new URL("@/assets/avatars/avatar3.png", import.meta.url).href,
  new URL("@/assets/avatars/avatar4.png", import.meta.url).href,
  new URL("@/assets/avatars/avatar5.png", import.meta.url).href,
];

const selectedPreAvatar = ref(null);
const router = useRouter();
const serverBaseURL = inject("baseURL");

const authStore = useAuthStore();
const apiStore = useAPIStore();
const currentPwd = ref("");
const newPwd = ref("");
const confirmPwd = ref("");
const pwdErrors = ref([]);
const pwdSuccess = ref(false);

const {currentUser} = storeToRefs(authStore);

const formData = ref({
  name: "",
  email: "",
  nickname: ""
});

watch(
    () => authStore.currentUser,
    (user) => {
      if (user) {
        formData.value = {
          name: user.name || "",
          email: user.email || "",
          nickname: user.nickname || ""
        };
      }
    },
    {immediate: true}
);

const {files, open, reset} = useFileDialog({
  accept: "image/*",
  multiple: false,
});

function goBack() {
  router.push({name: "home"});
}

//Função auxiliar formatação de data
function formatShortDate(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}


const choosePreAvatar = async (url) => {
  selectedPreAvatar.value = url;
  avatarUrl.value = url;

  const res = await apiStore.updateAvatar(url, true);
  if (res.ok) toast.success("Avatar updated successfully!");
  else toast.error(res.errors.join(", "));
};

const uploadPhoto = async (av) => {
  try {
    let fileToUpload = null;

    if (files.value && files.value.length > 0) {
      // --- Caminho para Upload de Ficheiro ---
      fileToUpload = files.value[0];
      selectedPreAvatar.value = null; // Limpa a seleção predefinida
      reset(); // Limpa o file dialog
    } else if (av) {
      // 1. Faz fetch da imagem a partir da URL local
      const response = await fetch(av);
      const blob = await response.blob();

      // 2. Extrai o nome do ficheiro (ex: "avatar1.png")
      const filename = av.split("/").pop();

      // 3. Cria um objeto File a partir do blob
      fileToUpload = new File([blob], filename, {type: blob.type});

      // 4. Atualiza o estado da seleção
      selectedPreAvatar.value = av;
    }

    const response = await apiStore.uploadProfilePhoto(fileToUpload);

    if (response.data && response.data.photo_avatar_filename) {
      await apiStore.patchUserPhoto(
          authStore.currentUser.id,
          response.data.photo_avatar_filename
      );
      await authStore.getUser();

      toast.success("Profile photo updated successfully");

      reset();
    }
  } catch (error) {
    console.error("Failed to upload photo:", error);
    toast.success("Failed to upload photo. Please try again.");
  }
};

const saveProfile = async () => {
  try {
    const user = Object.assign({}, authStore.currentUser);

    user.name = formData.value.name;
    user.nickname = formData.value.nickname

    await apiStore.putUser(user);
    await authStore.getUser();
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error("Failed to update profile:", error);
    toast.error("Failed to update profile. Please try again.");
  }
};

const onSubmitPassword = async (e) => {
  e.preventDefault();
  try {
    await apiStore.changePassword({
      current: currentPwd.value,
      next: newPwd.value,
      confirm: confirmPwd.value,
    });
    pwdSuccess.value = true;
    pwdErrors.value = [];
    currentPwd.value = "";
    newPwd.value = "";
    confirmPwd.value = "";
    toast.success("Password changed successfully!");
  } catch (err) {
    pwdSuccess.value = false;
    pwdErrors.value = err.response?.data?.errors || [
      "Failed to change password",
    ];
  }
};

const logout = () => {
  toast.promise(authStore.logout(), {
    loading: "Calling API",
    success: () => {
      router.push("/login");
      return "Logout Sucessfull ";
    },
    error: (data) => `[API] Error logout - ${data?.response?.data?.message}`,
  });
};

const requestNotification = () => {
  apiStore.requestNotification().then(() => {
    toast.success('Request sent! You will be notified shortly.')
  }).catch(() => {
    toast.error('Failed to send request. Please try again later.')
  });
}
</script>

<template>
  <main class="container mx-auto px-4 pt-4 text-black pb-12">
    <button aria-label="Back to Home"
            class="inline-flex cursor-pointer items-center gap-2 text-black/80 hover:text-black transition mb-4"
            @click="goBack">
      <ArrowLeft class="size-5"/>
      <span>Back</span>
    </button>

    <div class="grid lg:grid-cols-3 gap-4">
      <!-- Profile summary card -->
      <section class="lg:col-span-1 bg-white/70 border border-black/30 rounded-xl p-4 md:p-6">
        <div class="flex flex-col items-center text-center">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col sm:flex-row items-start gap-6">
                <div class="flex-shrink-0">
                  <Avatar class="w-32 h-32">
                    <AvatarImage v-if="authStore.currentUser?.photo_avatar_filename"
                      :src="`${serverBaseURL}/storage/photos_avatars/${authStore.currentUser.photo_avatar_filename}`"
                      :alt="authStore.currentUser.name" />
                    <AvatarFallback class="text-4xl">
                      {{ authStore.currentUser.name?.charAt(0).toUpperCase() }}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div class="flex-1 space-y-3">
                  <div class="flex flex-wrap gap-2">
                    <Button @click="open" variant="outline">
                      Choose Photo
                    </Button>
                    <Button v-if="files" @click="uploadPhoto">Save Photo</Button>
                    <Button v-if="files" @click="reset" variant="ghost">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardContent>
              <p class="text-sm font-medium mb-1">
                Or choose a predefined avatar:
              </p>

              <div class="grid grid-cols-5 gap-2">
                <div v-for="(av, i) in predefinedAvatars" :key="i"
                     class="cursor-pointer rounded-full overflow-hidden border-2 transition" :class="selectedPreAvatar === av
                      ? 'border-emerald-600'
                      : 'border-transparent'
                    " @click="uploadPhoto(av)">
                  <Avatar class="w-full h-full object-cover">
                    <AvatarImage :src="av" :alt="key"/>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
          <h1 class="mt-3 text-2xl font-bold">{{ currentUser?.name }}</h1>
          <p class="text-black/70">@{{ currentUser?.nickname }}</p>

          <div class="mt-4 grid grid-cols-3 gap-2 w-full mb-2">
            <div>
              <div class="text-xs uppercase tracking-wide text-black/60">
                Coins
              </div>
              <div class="flex items-center gap-1 text-lg font-semibold text-center justify-center">
                <Coins class="size-4 text-yellow-600"/>
                {{ currentUser?.coins_balance }}
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wide text-black/60">
                Rating
              </div>
              <div class="flex items-center gap-1 text-lg font-semibold text-center justify-center">
                <Trophy class="size-4 text-emerald-700"/>
                {{ currentUser?.rating }}
              </div>
            </div>
            <div>
              <div class="text-xs uppercase tracking-wide text-black/60">
                Rank
              </div>
              <div class="flex items-center gap-1 text-lg font-semibold text-center justify-center">
                <Crown class="size-4 text-amber-700"/>
                #{{ rank }}
              </div>
            </div>
          </div>

          <div class="mt-4 text-sm text-black/70">
            Member since {{ formatShortDate(currentUser?.created_at) }}
          </div>

          <button @click.prevent="requestNotification" role="button"
                  class="cursor-pointer mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/30 bg-black/5 text-black/80 hover:bg-black/10 active:bg-black/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
            Request Notification
          </button>
          <button @click.prevent="logout" role="button"
                  class="cursor-pointer mt-12 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-black/30 bg-black/5 text-black/80 hover:bg-black/10 active:bg-black/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition">
            Logout
          </button>
        </div>
      </section>

      <!-- Forms -->
      <section class="lg:col-span-2 grid gap-4">
        <!-- Profile info form -->
        <div class="bg-white/70 border border-black/30 rounded-xl p-4 md:p-6">
          <Card class="bg-white/0 border-0">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4 grid sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Name</Label>
                <Input id="name" v-model="formData.name" placeholder="Enter your name"
                       class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"/>
              </div>
              <div class="space-y-2">
                <Label for="nickname">Nickname</Label>
                <Input id="nickname" v-model="formData.nickname" placeholder="Enter your nickname"
                       class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"/>
              </div>
            </CardContent>
            <CardFooter class="flex justify-between">
              <Button @click="saveProfile"> Save Changes</Button>
            </CardFooter>
          </Card>
        </div>

        <!-- Change password form -->
        <form class="bg-white/70 border border-black/30 rounded-xl p-4 md:p-6" @submit="onSubmitPassword">
          <h2 class="text-xl font-semibold mb-4">Change password</h2>

          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium mb-1" for="current">Current password</label>
              <input id="current" v-model="currentPwd"
                     class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                     type="password"/>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="new">New password</label>
              <input id="new" v-model="newPwd"
                     class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                     type="password"/>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1" for="confirm">Confirm new password</label>
              <input id="confirm" v-model="confirmPwd"
                     class="w-full rounded-md border border-black/30 bg-white/70 px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
                     type="password"/>
            </div>
          </div>

          <div v-if="pwdErrors.length" class="mt-3 rounded-md border border-red-300 bg-red-50 text-red-700 p-3 text-sm">
            <ul class="list-disc pl-5">
              <li v-for="e in pwdErrors" :key="e">{{ e }}</li>
            </ul>
          </div>
          <div v-if="pwdSuccess"
               class="mt-3 rounded-md border border-emerald-300 bg-emerald-50 text-emerald-700 p-3 text-sm">
            Password changed successfully.
          </div>

          <div class="mt-4 flex justify-end">
            <button
                class="cursor-pointer px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800"
                type="submit">
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped></style>
