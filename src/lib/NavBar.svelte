<script>
    let activeTab = 'Home';

    function setActiveTab(tab) {
        activeTab = tab;
    }
</script>

<div class="navbar">
    <a href="#" class:active={activeTab === 'Home'} on:click={() => setActiveTab('Home')}>Home</a>
    <a href="#" class:active={activeTab === 'About'} on:click={() => setActiveTab('About')}>About</a>
    <a href="#" class:active={activeTab === 'Contact'} on:click={() => setActiveTab('Contact')}>Contact</a>
</div>

<style>
    .navbar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: #f0f0f0;
        display: flex;
        justify-content: space-around;
        padding: 10px;
    }

    .navbar a {
        text-decoration: none;
        color: #333;
        font-weight: bold;
    }

    .navbar a.active {
        color: #007bff;
    }
</style>