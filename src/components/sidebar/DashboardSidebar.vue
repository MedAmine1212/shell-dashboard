<template>
    <!--Main Navigation-->
    <header>
        <!-- Sidebar -->
        <nav
                id="sidebarMenu"
                class="collapse d-lg-block sidebar collapse bg-white"
        >
            <div class="position-sticky">
                <div class="list-group list-group-flush mx-3 mt-4">
                    <router-link
                            to="/dashboard/stations"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                            aria-current="true"
                    >
                        <i class="fas fa-building fa-fw me-3"></i
                        ><span>Stations</span>
                    </router-link>
                    <router-link
                            to="/dashboard/clients"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                    ><i class="fas fa-users fa-fw me-3"></i><span>Clients</span></router-link
                    >

                    <router-link
                            to="/dashboard/employees"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                    >
                        <i class="fas fa-toolbox fa-fw me-3"></i><span>Employees</span>
                    </router-link>
                    <router-link
                            to="/dashboard/stationAdmins"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                    ><i class="fas fa-lock fa-fw me-3"></i><span>Station admins</span></router-link
                    >
                    <router-link
                            to="/dashboard/services"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                    ><i class="fas fa-oil-can fa-fw me-3"></i><span>Services</span></router-link
                    >
                    <router-link
                            to="/dashboard/products"
                            class="list-group-item list-group-item-action py-2 ripple"
                            active-class="active"
                    ><i class="fad fa-servicestack fa-fw me-3"></i><span>Products</span></router-link
                    >
                    <router-link
                            :to="`/dashboard/ads/0/0`"
                            active-class="active"
                            class="list-group-item list-group-item-action py-2 ripple"
                    ><i class="fas fa-globe fa-fw me-3"></i
                    ><span>Ads</span></router-link
                    >
                    <router-link
                            :to="`/dashboard/workschedules/0`"
                            active-class="active"
                            class="list-group-item list-group-item-action py-2 ripple"
                    ><i class="fas fa-calendar fa-fw me-3"></i
                    ><span>Work schedules</span></router-link
                    >
                    <router-link
                            active-class="active"
                            to="/dashboard/analytics"
                            class="list-group-item list-group-item-action py-2 ripple"
                    ><i class="fas fa-chart-line fa-fw me-3"></i
                    ><span>Analytics</span></router-link
                    >
                </div>
            </div>
        </nav>
        <!-- Sidebar -->

        <!-- Navbar -->
        <nav
                id="main-navbar"
                class="navbar navbar-expand-lg navbar-light bg-white fixed-top"
        >
            <!-- Container wrapper -->
            <div class="container-fluid">
                <!-- Toggle button -->
                <button
                        class="navbar-toggler"
                        type="button"
                        data-mdb-toggle="collapse"
                        data-mdb-target="#sidebarMenu"
                        aria-controls="sidebarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                >
                    <i class="fas fa-bars"></i>
                </button>

                <!-- Brand -->
                <a class="navbar-brand" href="#">
                    <img
                            src="../../assets/images/Shell-Logo.png"
                            height="40"
                            alt=""
                            loading="lazy"
                    />
                </a>


                <!-- Right links -->
                <ul class="navbar-nav ms-auto d-flex flex-row">
                    <!-- Notification dropdown -->
                    <li class="nav-item dropdown">
                        <a
                                class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                                href="#"
                                id="navbarDropdownMenuLink2"
                                role="button"
                                data-mdb-toggle="dropdown"
                                aria-expanded="false"
                        >
                            <i class="fas fa-bell"></i>
                            <span class="badge rounded-pill badge-notification bg-danger"
                            >1</span
                            >
                        </a>
                        <ul
                                class="dropdown-menu dropdown-menu-end"
                                aria-labelledby="navbarDropdownMenuLink"
                        >
                            <li><a class="dropdown-item" href="#">Some news</a></li>
                            <li><a class="dropdown-item" href="#">Another news</a></li>
                            <li>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </li>
                        </ul>
                    </li>

                    <!-- Icon -->
                    <li class="nav-item">
                        <a class="nav-link me-3 me-lg-0" href="#">
                            <i class="fas fa-fill-drip"></i>
                        </a>
                    </li>
                    <!-- Icon -->
                    <li class="nav-item me-3 me-lg-0">
                        <a class="nav-link" href="#">
                            <i class="fab fa-github"></i>
                        </a>
                    </li>

                    <!-- Icon dropdown -->
                    <li style="margin-top: 5px;margin-left: 20px;margin-right: -20px" class="nav-item">Super admin</li>
                    <li class="nav-item dropdown">
                        <a
                                class="nav-link me-3 me-lg-0 dropdown-toggle hidden-arrow"
                                href="#"
                                id="navbarDropdown"
                                role="button"
                                data-mdb-toggle="dropdown"
                                aria-expanded="false"
                        >
                            <i class="united kingdom flag m-0"></i>
                        </a>
                        <ul
                                class="dropdown-menu dropdown-menu-end"
                                aria-labelledby="navbarDropdown"
                        >
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="united kingdom flag"></i>English
                                    <i class="fa fa-check text-success ms-2"></i
                                    ></a>
                            </li>
                            <li><hr class="dropdown-divider" /></li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="poland flag"></i>Polski</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="china flag"></i>中文</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="japan flag"></i>日本語</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="germany flag"></i>Deutsch</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="france flag"></i>Français</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="spain flag"></i>Español</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="russia flag"></i>Русский</a
                                >
                            </li>
                            <li>
                                <a class="dropdown-item" href="#"
                                ><i class="portugal flag"></i>Português</a
                                >
                            </li>
                        </ul>
                    </li>

                    <!-- Avatar -->
                    <li class="nav-item dropdown">
                        <a
                                class="nav-link dropdown-toggle hidden-arrow d-flex align-items-center"
                                href="#"
                                id="navbarDropdownMenuLink"
                                role="button"
                                data-mdb-toggle="dropdown"
                                aria-expanded="false"
                        >
                            <img
                                    src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"
                                    class="rounded-circle"
                                    height="22"
                                    alt=""
                                    loading="lazy"
                            />
                        </a>
                        <ul
                                class="dropdown-menu dropdown-menu-end"
                                aria-labelledby="navbarDropdownMenuLink"
                        >
                            <li><a class="dropdown-item" href="#">My profile</a></li>
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li><a class="dropdown-item" href="#">Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- Container wrapper -->
        </nav>
        <!-- Navbar -->
    </header>
    <!--Main Navigation-->
</template>

<script>


    export default {
        name: 'DashboardSideBar',
    }
</script>

<style scoped>
    .sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        padding: 58px 0 0; /* Height of navbar */
        width: 240px;
        z-index: 600;
    }

    @media (max-width: 991.98px) {
        .sidebar {
            width: 100%;
        }
    }
    .sidebar .active {
        border-radius: 5px;
    }

    .sidebar-sticky {
        position: relative;
        top: 0;
        height: calc(100vh - 48px);
        padding-top: 0.5rem;
        overflow-x: hidden;
        overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
    }
</style>