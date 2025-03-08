<template>
  <UContainer class="component">
    <ClientOnly>
      <UButton v-if="authState === 'AUTHENTICATED'" @click="signOutUser">
        Sign Out
      </UButton>

      <template v-else>
        <button @click="handleSignInGoogle">
          <img src="/img/sign-in-dark.svg" alt="Sign in with Google" />
        </button>

        <USeparator label="or" />

        <UInput v-model="email" placeholder="Email" />
        <UInput v-model="password" type="password" placeholder="Password" />

        <div class="auth-actions">
          <UButton @click="handleSignInEmail">
            Sign in
          </UButton>
          <UButton @click="handleSignUpEmail">
            Sign up
          </UButton>
        </div>
      </template>
    </ClientOnly>
  </UContainer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const { authState, signOutUser, signInWithGoogle, signInWithEmailPassword, signUpWithEmailPassword } = useAuth()
const { userState, createUser } = useUser()

const email = ref('')
const password = ref('')

// Ensure Firestore user exists before redirecting
const checkUserAndRedirect = async () => {
  if (authState.value === 'AUTHENTICATED' && userState.value === 'DOES_NOT_EXIST') {
    await createUser()
  }

  // Watch for Firestore updates and redirect when user is confirmed
  watchEffect(() => {
    if (userState.value === 'EXISTS') {
      router.push('/dashboard')
    }
  })
}

const handleSignInGoogle = async () => {
  await signInWithGoogle()
  await checkUserAndRedirect()
}

const handleSignInEmail = async () => {
  await signInWithEmailPassword(email.value, password.value)
  await checkUserAndRedirect()
}

const handleSignUpEmail = async () => {
  await signUpWithEmailPassword(email.value, password.value)
  await checkUserAndRedirect()
}
</script>

<style scoped>
.auth-actions {
  display: flex;
  gap: var(--spacing-s);
  justify-content: center;
}
</style>