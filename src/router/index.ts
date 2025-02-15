import { userAuthorisationGuard } from '@/router/middleware'
import { createRouter, createWebHistory } from 'vue-router'
import GalleryPage from '@/components/GalleryPage/GalleryPage.vue'
import BackOfficePage from '@/components/BackOfficePage/BackOfficePage.vue'
import LoginPage from '@/components/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/',
      name: 'home',
      component: GalleryPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: BackOfficePage,
      redirect: { name: 'profile' },
      children: [
        {
          path: 'account',
          name: 'account',
          redirect: { name: 'profile' },
          children: [
            {
              path: 'profile',
              name: 'profile',
              component: () =>
                import(
                  '@/components/BackOfficePage/AccountPage/ProfilePage.vue'
                )
            },
            {
              path: 'appearance',
              name: 'appearance',
              component: () =>
                import(
                  '@/components/BackOfficePage/AccountPage/AppearancePage.vue'
                )
            }
          ]
        },
        {
          path: 'actions',
          name: 'actions',
          component: () => import('@/components/BackOfficePage/ActionsPage/ActionsPage.vue')
        },
        {
          path: 'users',
          name: 'users',
          redirect: { name: 'all-users' },
          children: [
            {
              path: 'all-users',
              name: 'all-users',
              component: () =>
                import(
                  '@/components/BackOfficePage/UsersPages/UsersPage/UsersPage.vue'
                )
            },
            {
              path: 'groups',
              name: 'groups',
              component: () =>
                import(
                  '@/components/BackOfficePage/UsersPages/GroupsPage.vue'
                )
            },
            {
              path: 'roles',
              name: 'roles',
              component: () =>
                import(
                  '@/components/BackOfficePage/UsersPages/RolesPage.vue'
                )
            }
          ]
        }
      ]
    }

    // {
    //   path: '/',
    //   name: 'actions',
    //   component: ActionPage
    // },
  ]
})

router.beforeEach(userAuthorisationGuard)

export default router
