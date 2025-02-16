<div class="container">
    <div class="login">
        <img src="/logo_white_trans.png" alt="Ladeklubben Logo">
        <form>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .login {
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
    }

    img {
        width: 100px;

    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;

    }

    label {
        font-weight: bold;
        margin: 0;
    }

    input {
        padding: 1rem;
        background-color: transparent;
        border: 1px solid var(--lk-blue-500);
        border-radius: 20px;
        color: var(--lk-blue-50);
    }

    input:focus {
        border-color: var(--lk-blue-300);
        outline: none;
    }

    button {
        padding: 1rem;
        font-size: 1.2rem;
        font-weight: bold;
        background-color: var(--lk-blue-500);
        border: 1px solid var(--lk-blue-500);
        border-radius: 20px;
        color: white;
        margin-top: 1rem;
        cursor: pointer;
    }
</style>